const asyncHandler = require('../utils/asyncHandler');
const comparisonService = require('../services/comparisonService');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const createComparison = asyncHandler(async (req, res) => {
  const { resumeAId, resumeBId, resumeId, analysisId, jobDescriptionId } = req.body;
  const comparison = await comparisonService.createComparison(
    req.user.id,
    { resumeId: resumeId || resumeAId, resumeBId, analysisId, jobDescriptionId },
    getReqContext(req)
  );
  res.status(201).json({
    success: true,
    message: 'Comparison created successfully',
    data: comparison,
    requestId: req.requestId,
  });
});

const getComparison = asyncHandler(async (req, res) => {
  const comparison = await comparisonService.getComparison(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Comparison retrieved',
    data: comparison,
    requestId: req.requestId,
  });
});

const listComparisons = asyncHandler(async (req, res) => {
  const result = await comparisonService.listComparisons(req.user.id, req.query);
  res.json({
    success: true,
    message: 'Comparisons retrieved',
    data: result.comparisons,
    meta: result.pagination,
    requestId: req.requestId,
  });
});

module.exports = {
  createComparison,
  getComparison,
  listComparisons,
};