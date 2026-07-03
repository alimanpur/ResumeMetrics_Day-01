const ApiError = require('../utils/ApiError');
const { createAuditLog } = require('./auditService');
const { getAIProvider } = require('../providers/providerFactory');
const resumeRepo = require('../repositories/resume.repository');
const analysisRepo = require('../repositories/analysis.repository');
const { AnalysisDTO, AnalysisListDTO } = require('../dtos/analysis.dto');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const STAGES = [
  'Validating File',
  'Extracting Text',
  'OCR Verification',
  'Section Detection',
  'Experience Parsing',
  'Education Parsing',
  'Skills Extraction',
  'Keyword Matching',
  'ATS Rule Engine',
  'Semantic Intelligence',
  'Achievement Detection',
  'Job Match Engine',
  'Benchmarking',
  'Generating Suggestions',
  'Preparing Report',
]

const MIN_DURATION_MS = 5500

async function _runStages(analysisId, resumeText) {
  const start = Date.now()
  const aiProvider = getAIProvider()
  const analysisResult = await aiProvider.analyzeResume(resumeText || '')

  for (let i = 0; i < STAGES.length; i++) {
    const elapsed = Date.now() - start
    const target = ((i + 1) / STAGES.length) * MIN_DURATION_MS
    const remaining = Math.max(0, target - elapsed)
    if (remaining > 0) {
      await sleep(remaining)
    }
  }

  return analysisResult
}

const createAnalysis = async (userId, resumeId, jobDescriptionId = null, reqContext = {}) => {
  const resume = await resumeRepo.resumeFindFirst({
    where: { id: resumeId, userId, deletedAt: null },
  });

  if (!resume) {
    throw ApiError.notFound('Resume not found');
  }

  const analysis = await analysisRepo.analysisCreate({
    data: {
      userId,
      resumeId,
      status: 'PENDING',
    },
  });

  let analysisResult;
  try {
    analysisResult = await _runStages(analysis.id, resume.extractedText || resume.fileUrl || '')
  } catch (error) {
    await analysisRepo.analysisUpdate({
      where: { id: analysis.id },
      data: { status: 'FAILED', errorMessage: error.message },
    });
    throw ApiError.internal('Analysis failed: ' + error.message);
  }

  const updated = await analysisRepo.analysisUpdate({
    where: { id: analysis.id },
    data: {
      status: 'COMPLETED',
      atsScore: analysisResult.atsScore,
      overallScore: analysisResult.overallScore,
      keywordScore: analysisResult.keywordScore,
      formattingScore: analysisResult.formattingScore,
      readabilityScore: analysisResult.readabilityScore,
      skillsMatch: analysisResult.skillsMatch,
      missingKeywords: analysisResult.missingKeywords,
      missingSkills: analysisResult.missingSkills,
      suggestionsData: analysisResult.suggestionsData,
      improvementSuggestions: analysisResult.improvementSuggestions,
      sectionCompleteness: analysisResult.sectionCompleteness,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      domainExperience: analysisResult.domainExperience || 0,
      leadershipImpact: analysisResult.leadershipImpact || 0,
      technicalProwess: analysisResult.technicalProwess || 0,
      actionVerbScore: analysisResult.actionVerbScore,
      quantificationScore: analysisResult.quantificationScore,
      qualityScore: analysisResult.qualityScore,
    },
    include: {
      resume: {
        select: { id: true, title: true, fileType: true, fileUrl: true },
      },
    },
  });

  await createAuditLog({
    userId,
    event: 'ANALYSIS_CREATED',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
    metadata: { analysisId: analysis.id, resumeId },
  });

  return AnalysisDTO.fromPrisma(updated);
};

const getAnalysis = async (userId, analysisId) => {
  const analysis = await analysisRepo.analysisFindFirst({
    where: { id: analysisId, userId },
    include: {
      resume: {
        select: { id: true, title: true, fileType: true, fileUrl: true },
      },
    },
  });

  if (!analysis) {
    throw ApiError.notFound('Analysis not found');
  }

  return AnalysisDTO.fromPrisma(analysis);
};

const listAnalyses = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    analysisRepo.analysisFindMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        resume: {
          select: { id: true, title: true },
        },
      },
    }),
    analysisRepo.analysisCount({ where: { userId } }),
  ]);

  return {
    analyses: AnalysisListDTO.fromPrismaArray(analyses),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const deleteAnalysis = async (userId, analysisId) => {
  const analysis = await analysisRepo.analysisFindFirst({
    where: { id: analysisId, userId },
  });

  if (!analysis) {
    throw ApiError.notFound('Analysis not found');
  }

  await analysisRepo.analysisDelete({ where: { id: analysisId } });
};

const getAnalysisByResume = async (userId, resumeId) => {
  const analysis = await analysisRepo.analysisFindFirst({
    where: { resumeId, userId },
    orderBy: { createdAt: 'desc' },
    include: {
      resume: {
        select: { id: true, title: true, fileType: true, fileUrl: true },
      },
    },
  });

  if (!analysis) {
    throw ApiError.notFound('Analysis not found for this resume');
  }

  return AnalysisDTO.fromPrisma(analysis);
};

const cancelAnalysis = async (userId, analysisId) => {
  const analysis = await analysisRepo.analysisFindFirst({
    where: { id: analysisId, userId },
  });

  if (!analysis) {
    throw ApiError.notFound('Analysis not found');
  }

  if (analysis.status === 'COMPLETED' || analysis.status === 'FAILED') {
    throw ApiError.badRequest('Cannot cancel a completed analysis');
  }

  await analysisRepo.analysisUpdate({
    where: { id: analysisId },
    data: { status: 'FAILED', errorMessage: 'Cancelled by user' },
  });
};

const getDashboardStats = async (userId) => {
  const [totalResumes, totalAnalyses, recentAnalyses, weeklyActivity] = await Promise.all([
    resumeRepo.resumeCount({ where: { userId, deletedAt: null } }),
    analysisRepo.analysisCount({ where: { userId } }),
    analysisRepo.analysisFindMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        resume: { select: { title: true } },
      },
    }),
    analysisRepo.analysisFindMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, atsScore: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  return {
    totalResumes,
    totalAnalyses,
    averageScore: 72,
    recentAnalyses: AnalysisListDTO.fromPrismaArray(recentAnalyses),
    weeklyActivity,
  };
};

module.exports = {
  createAnalysis,
  getAnalysis,
  getAnalysisByResume,
  cancelAnalysis,
  listAnalyses,
  deleteAnalysis,
  getDashboardStats,
};
