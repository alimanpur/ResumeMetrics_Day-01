const asyncHandler = require('../utils/asyncHandler');
const resumeService = require('../services/resumeService');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.uploadResume(req.user.id, req.file, req.body.metadata, getReqContext(req));
  res.status(201).json({
    success: true,
    message: 'Resume uploaded successfully',
    data: resume,
    requestId: req.requestId,
  });
});

const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.user.id, req.params.id, getReqContext(req));
  res.json({
    success: true,
    message: 'Resume deleted successfully',
    requestId: req.requestId,
  });
});

const listResumes = asyncHandler(async (req, res) => {
  const result = await resumeService.listResumes(req.user.id, req.query);
  res.json({
    success: true,
    message: 'Resumes retrieved',
    data: result.resumes,
    meta: result.pagination,
    requestId: req.requestId,
  });
});

const getResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResume(req.user.id, req.params.id);
  res.json({
    success: true,
    message: 'Resume retrieved',
    data: resume,
    requestId: req.requestId,
  });
});

module.exports = {
  uploadResume,
  deleteResume,
  listResumes,
  getResume,
};