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

async function _runStages(userId, resumeId, analysisId, resume, jobDescriptionId) {
  const startTime = Date.now()
  const aiProvider = getAIProvider()

  const resumeText = resume.extractedText || ''

  let allAnalyses = []
  let allResumeVersions = []
  try {
    [allAnalyses] = await Promise.all([
      analysisRepo.analysisFindMany({
        where: { resumeId, userId },
        select: { id: true, atsScore: true, overallScore: true, keywordScore: true, readabilityScore: true, actionVerbScore: true, quantificationScore: true, qualityScore: true, createdAt: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])
  } catch (e) {
    console.warn('Phase19: failed to fetch historical analyses for evolution engine', e.message)
  }

  const aiResult = await aiProvider.analyzeResume(resumeText, {
    resume,
    allAnalyses,
    allResumeVersions: [],
    jobDescriptionId,
    analysisId,
  })

  for (let i = 0; i < STAGES.length; i++) {
    const elapsed = Date.now() - startTime
    const target = ((i + 1) / STAGES.length) * MIN_DURATION_MS
    const remaining = Math.max(0, target - elapsed)
    if (remaining > 0) {
      await sleep(remaining)
    }
  }

  return aiResult
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
    analysisResult = await _runStages(userId, resumeId, analysis.id, resume, jobDescriptionId)
  } catch (error) {
    await analysisRepo.analysisUpdate({
      where: { id: analysis.id },
      data: { status: 'FAILED', errorMessage: error.message },
    });
    throw ApiError.internal('Analysis failed: ' + error.message);
  }

  const updateData = {
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
    comprehensiveReport: analysisResult.comprehensiveReport || null,
    executiveSummary: analysisResult.comprehensiveReport?.executiveSummary || null,
    credibilityAnalysis: analysisResult.credibility || null,
    skillsIntelligence: analysisResult.skillsEvidence || null,
    experienceIntelligence: analysisResult.experienceIntelligence || null,
    projectIntelligence: analysisResult.projectIntelligence || null,
    interviewPrep: analysisResult.interviewPrep || null,
    learningRoadmap: analysisResult.learningRoadmap || null,
    resumeEvolution: analysisResult.resumeEvolution || null,
    recruiterAnalysis: analysisResult.comprehensiveReport?.recruiterNotes || null,
    processingTime: analysisResult.metadata?.processingTime || analysisResult.metadata?.processingTime,
    aiProvider: analysisResult.metadata?.aiProvider || analysisResult.aiProvider,
    aiModel: analysisResult.metadata?.aiModel || analysisResult.aiModel,
  }

  const updated = await analysisRepo.analysisUpdate({
    where: { id: analysis.id },
    data: updateData,
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
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 10));
  const skip = (page - 1) * limit;

  try {
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
  } catch (error) {
    console.error('[analysisService.listAnalyses] FAILED:', error.message, error.stack);
    throw error;
  }
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
      select: { createdAt: true, atsScore: true, overallScore: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const completedAnalyses = await analysisRepo.analysisFindMany({
    where: { userId, status: 'COMPLETED' },
    select: { atsScore: true, overallScore: true, createdAt: true, qualityScore: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const nonEmptyScores = completedAnalyses
    .map(a => a.atsScore || a.overallScore)
    .filter(s => typeof s === 'number' && !isNaN(s))

  const averageAtsScore = nonEmptyScores.length > 0 ? Math.round(nonEmptyScores.reduce((a, b) => a + b, 0) / nonEmptyScores.length) : 0

  const bestAnalysis = completedAnalyses.length > 0
    ? completedAnalyses.reduce((best, curr) => {
        const currScore = (curr.atsScore || curr.overallScore || 0)
        const bestScore = (best.atsScore || best.overallScore || 0)
        return currScore > bestScore ? curr : best
      }, completedAnalyses[0])
    : null

  return {
    totalResumes,
    totalAnalyses,
    averageScore: averageAtsScore,
    recentAnalyses: AnalysisListDTO.fromPrismaArray(recentAnalyses),
    weeklyActivity,
    intelligence: {
      averageAtsScore,
      bestScore: bestAnalysis ? (bestAnalysis.atsScore || bestAnalysis.overallScore) : 0,
      bestResumeTitle: bestAnalysis?.resume?.title || null,
      totalCompleted: completedAnalyses.length,
      improvementTrend: nonEmptyScores.length >= 2 && nonEmptyScores[nonEmptyScores.length - 1] > nonEmptyScores[0] ? 'improving' : nonEmptyScores.length >= 2 && nonEmptyScores[nonEmptyScores.length - 1] < nonEmptyScores[0] ? 'declining' : 'stable',
    },
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
