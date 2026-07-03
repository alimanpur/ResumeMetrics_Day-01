const asyncHandler = require('../utils/asyncHandler');
const analysisService = require('../services/analysisService');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const createAnalysis = asyncHandler(async (req, res) => {
  const analysis = await analysisService.createAnalysis(
    req.user.id,
    req.body.resumeId,
    req.body.jobDescriptionId,
    getReqContext(req)
  );
  res.status(201).json({
    success: true,
    message: 'Analysis created successfully',
    data: analysis,
    requestId: req.requestId,
  });
});

const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Analysis retrieved',
    data: analysis,
    requestId: req.requestId,
  });
});

const getAnalysisByResume = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysisByResume(req.user.id, req.params.resumeId);
  res.json({
    success: true,
    message: 'Analysis retrieved',
    data: analysis,
    requestId: req.requestId,
  });
});

const cancelAnalysis = asyncHandler(async (req, res) => {
  await analysisService.cancelAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Analysis cancelled',
    data: null,
    requestId: req.requestId,
  });
});

const listAnalyses = asyncHandler(async (req, res) => {
  const result = await analysisService.listAnalyses(req.user.id, req.query);
  res.json({
    success: true,
    message: 'Analyses retrieved',
    data: result.analyses,
    meta: result.pagination,
    requestId: req.requestId,
  });
});

const deleteAnalysis = asyncHandler(async (req, res) => {
  await analysisService.deleteAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Analysis deleted successfully',
    data: null,
    requestId: req.requestId,
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analysisService.getDashboardStats(req.user.id);
  res.json({
    success: true,
    message: 'Dashboard stats retrieved',
    data: stats,
    requestId: req.requestId,
  });
});

const getComprehensiveReport = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Comprehensive report retrieved',
    data: analysis.comprehensiveReport || null,
    requestId: req.requestId,
  });
});

const getCredibilityAnalysis = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Credibility analysis retrieved',
    data: analysis.credibilityAnalysis || null,
    requestId: req.requestId,
  });
});

const getSkillsIntelligence = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Skills intelligence retrieved',
    data: analysis.skillsIntelligence || null,
    requestId: req.requestId,
  });
});

const getExperienceIntelligence = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Experience intelligence retrieved',
    data: analysis.experienceIntelligence || null,
    requestId: req.requestId,
  });
});

const getProjectIntelligence = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Project intelligence retrieved',
    data: analysis.projectIntelligence || null,
    requestId: req.requestId,
  });
});

const getInterviewPrep = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Interview preparation retrieved',
    data: analysis.interviewPrep || null,
    requestId: req.requestId,
  });
});

const getLearningRoadmap = asyncHandler(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Learning roadmap retrieved',
    data: analysis.learningRoadmap || null,
    requestId: req.requestId,
  });
});

module.exports = {
  createAnalysis,
  getAnalysis,
  getAnalysisByResume,
  cancelAnalysis,
  listAnalyses,
  deleteAnalysis,
  getDashboardStats,
  getComprehensiveReport,
  getCredibilityAnalysis,
  getSkillsIntelligence,
  getExperienceIntelligence,
  getProjectIntelligence,
  getInterviewPrep,
  getLearningRoadmap,
};
