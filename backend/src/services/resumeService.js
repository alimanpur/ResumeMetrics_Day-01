const path = require('path');
const fs = require('fs').promises;
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary, deleteFromCloudinary } = require('../lib/cloudinary');
const { createAuditLog } = require('./auditService');
const resumeRepo = require('../repositories/resume.repository');
const analysisRepo = require('../repositories/analysis.repository');
const { getAIProvider } = require('../providers/providerFactory');
const { ResumeDTO, ResumeDetailDTO } = require('../dtos/resume.dto');
const logger = require('../lib/logger');

const SORT_MAP = {
  date: 'createdAt',
  newest: 'createdAt',
  oldest: 'createdAt',
  score: 'atsScore',
  title: 'title',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

const uploadResume = async (userId, file, metadata, reqContext = {}) => {
  if (!file) {
    throw ApiError.badRequest('No file uploaded');
  }

  let cloudinaryResult = null;
  try {
    cloudinaryResult = await uploadToCloudinary(file.path);
  } catch (error) {
    logger.error(`Cloudinary upload failed: ${error.message}`, {
      fileName: file.originalname,
      error: error.message
    });
    throw new ApiError(500, 'Failed to upload file to cloud storage. Please try again.');
  }

  const resume = await resumeRepo.resumeCreate({
    data: {
      userId,
      title: file.originalname,
      fileUrl: cloudinaryResult?.secure_url || file.path,
      fileKey: cloudinaryResult?.public_id || file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      targetRole: metadata?.targetRole || null,
    },
  });

  // Clean up local file after cloudinary upload
  if (cloudinaryResult) {
    try {
      await fs.unlink(file.path);
    } catch {
      // Best-effort cleanup
    }
  }

  await createAuditLog({
    userId,
    event: 'RESUME_UPLOAD',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
    metadata: { resumeId: resume.id, originalName: file.originalname },
  });

  // Create analysis with PENDING status - will be processed asynchronously
  let analysis = null;
  try {
    analysis = await analysisRepo.analysisCreate({
      data: {
        userId,
        resumeId: resume.id,
        status: 'PENDING',
      },
    });

    // Process analysis asynchronously (don't await - let it run in background)
    processAnalysisAsync(userId, resume, analysis.id, reqContext).catch(err => {
      console.error('Background analysis failed:', err.message);
    });
  } catch (error) {
    // Create failed analysis record only if we couldn't even create the pending record
    try {
      analysis = await analysisRepo.analysisCreate({
        data: {
          userId,
          resumeId: resume.id,
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
    } catch {
      // Best-effort
    }
  }

  const resumeDTO = ResumeDTO.fromPrisma(resume);
  resumeDTO.analysisId = analysis?.id;
  
  return resumeDTO;
};

async function processAnalysisAsync(userId, resume, analysisId, reqContext) {
  try {
    // Update status to PROCESSING
    await analysisRepo.analysisUpdate({
      where: { id: analysisId },
      data: { status: 'PROCESSING' },
    });

    const aiProvider = getAIProvider();
    const analysisResult = await aiProvider.analyzeResume(resume.fileUrl || '');

    // Update with completed analysis
    await analysisRepo.analysisUpdate({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        atsScore: analysisResult.atsScore,
        overallScore: analysisResult.overallScore || analysisResult.atsScore,
        keywordScore: analysisResult.keywordScore || analysisResult.atsScore,
        formattingScore: analysisResult.formattingScore || analysisResult.atsScore,
        readabilityScore: analysisResult.readabilityScore || analysisResult.atsScore,
        qualityScore: analysisResult.qualityScore || analysisResult.atsScore,
        domainExperience: analysisResult.domainExperience || 0,
        leadershipImpact: analysisResult.leadershipImpact || 0,
        technicalProwess: analysisResult.technicalProwess || 0,
        actionVerbScore: analysisResult.actionVerbScore || 0,
        quantificationScore: analysisResult.quantificationScore || 0,
        skillsMatch: analysisResult.skillsMatch || analysisResult.keywordMatch,
        missingKeywords: analysisResult.missingKeywords || analysisResult.keywordMatch?.missing || [],
        missingSkills: analysisResult.missingSkills || [],
        suggestionsData: analysisResult.suggestionsData || [],
        improvementSuggestions: analysisResult.improvementSuggestions || analysisResult.suggestionsData || [],
        sectionCompleteness: analysisResult.sectionCompleteness || analysisResult.formattingAnalysis?.sections || [],
        strengths: analysisResult.strengths || analysisResult.semanticAnalysis || {},
        weaknesses: analysisResult.weaknesses || analysisResult.semanticAnalysis?.suggestions || [],
        rawSuggestions: analysisResult.suggestionsData || null,
        duplicateKeywords: null,
        keywordDensity: analysisResult.keywordDensity || null,
        aiProvider: 'mock',
        aiModel: 'mock-v1',
        processingTime: null,
      },
    });

    await createAuditLog({
      userId,
      event: 'ANALYSIS_COMPLETED',
      ip: reqContext.ip,
      requestId: reqContext.requestId,
      metadata: { analysisId, resumeId: resume.id },
    });
  } catch (error) {
    // Update analysis as FAILED
    try {
      await analysisRepo.analysisUpdate({
        where: { id: analysisId },
        data: { 
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
    } catch {
      // Best-effort
    }
    console.error('Analysis processing failed:', error.message);
  }
}

const deleteResume = async (userId, resumeId, reqContext = {}) => {
  const resume = await resumeRepo.resumeFindFirst({
    where: { id: resumeId, userId, deletedAt: null },
  });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  if (resume.fileKey && resume.fileKey.startsWith('resumes/')) {
    try {
      await deleteFromCloudinary(resume.fileKey);
    } catch {
      // Best-effort
    }
  }

  await resumeRepo.resumeUpdate({
    where: { id: resumeId },
    data: { deletedAt: new Date() },
  });

  await createAuditLog({
    userId,
    event: 'RESUME_DELETE',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
    metadata: { resumeId, originalName: resume.title },
  });
};

const listResumes = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  const search = options.search || '';
  const skip = (page - 1) * limit;

  const where = {
    userId,
    deletedAt: null,
    ...(search && {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const mappedSortBy = SORT_MAP[sortBy] || 'createdAt';
  const orderBy = { [mappedSortBy]: sortOrder };

  const [resumes, total] = await Promise.all([
    resumeRepo.resumeFindMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, atsScore: true, status: true },
        },
      },
    }),
    resumeRepo.resumeCount({ where }),
  ]);

  const formattedResumes = resumes.map(r => ({
    ...r,
    latestScore: r.analyses?.[0]?.atsScore || 0,
    status: r.analyses?.[0]?.status || 'PENDING',
    analysisId: r.analyses?.[0]?.id || null,
  }));

  return {
    resumes: ResumeDTO.fromPrismaArray(formattedResumes),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getResume = async (userId, resumeId) => {
  const resume = await resumeRepo.resumeFindFirst({
    where: { id: resumeId, userId, deletedAt: null },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, status: true, atsScore: true, createdAt: true },
      },
    },
  });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  return ResumeDetailDTO.fromPrisma(resume);
};

module.exports = {
  uploadResume,
  deleteResume,
  listResumes,
  getResume,
};