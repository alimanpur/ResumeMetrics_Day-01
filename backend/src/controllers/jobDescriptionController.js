const asyncHandler = require('../utils/asyncHandler');
const jdService = require('../services/jobDescriptionService');

const createJobDescription = asyncHandler(async (req, res) => {
  const jd = await jdService.createJobDescription(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: 'Job description created successfully',
    data: jd,
    requestId: req.requestId,
  });
});

const getJobDescription = asyncHandler(async (req, res) => {
  const jd = await jdService.getJobDescription(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Job description retrieved',
    data: jd,
    requestId: req.requestId,
  });
});

const listJobDescriptions = asyncHandler(async (req, res) => {
  const result = await jdService.listJobDescriptions(req.user.id, req.query);
  res.json({
    success: true,
    message: 'Job descriptions retrieved',
    data: result.jobDescriptions,
    meta: result.pagination,
    requestId: req.requestId,
  });
});

const deleteJobDescription = asyncHandler(async (req, res) => {
  await jdService.deleteJobDescription(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Job description deleted successfully',
    requestId: req.requestId,
  });
});

module.exports = {
  createJobDescription,
  getJobDescription,
  listJobDescriptions,
  deleteJobDescription,
};