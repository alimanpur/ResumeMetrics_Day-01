const asyncHandler = require('../utils/asyncHandler');
const settingsService = require('../services/settingsService');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings(req.user.id);
  res.json({
    success: true,
    message: 'Settings retrieved',
    data: settings,
    requestId: req.requestId,
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.user.id, req.body, getReqContext(req));
  res.json({
    success: true,
    message: 'Settings updated',
    data: settings,
    requestId: req.requestId,
  });
});

const updateNotificationSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.user.id, { notificationPreferences: req.body }, getReqContext(req));
  res.json({
    success: true,
    message: 'Notification settings updated',
    data: settings,
    requestId: req.requestId,
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  await settingsService.updatePassword(req.user.id, req.body.newPassword, getReqContext(req));
  res.json({
    success: true,
    message: 'Password updated successfully',
    data: null,
    requestId: req.requestId,
  });
});

module.exports = {
  getSettings,
  updateSettings,
  updateNotificationSettings,
  updatePassword,
};
