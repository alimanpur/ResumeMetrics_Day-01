const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const config = require('../config');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, getReqContext(req));
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
    requestId: req.requestId,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, getReqContext(req));
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.json({
    success: true,
    message: 'Login successful',
    data: result,
    requestId: req.requestId,
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(refreshToken, { ...getReqContext(req), userId: req.user?.id });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logout successful',
    data: null,
    requestId: req.requestId,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required',
      requestId: req.requestId,
    });
  }

  const result = await authService.refreshAccessToken(token, getReqContext(req));
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.json({
    success: true,
    message: 'Token refreshed',
    data: result,
    requestId: req.requestId,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email, getReqContext(req));
  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent',
    data: null,
    requestId: req.requestId,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password, getReqContext(req));
  res.json({
    success: true,
    message: 'Password reset successful',
    data: null,
    requestId: req.requestId,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.query.token, getReqContext(req));
  res.json({
    success: true,
    message: 'Email verified successfully',
    data: null,
    requestId: req.requestId,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword, getReqContext(req));
  res.json({
    success: true,
    message: 'Password changed successfully',
    data: null,
    requestId: req.requestId,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({
    success: true,
    message: 'Profile retrieved',
    data: user,
    requestId: req.requestId,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body, getReqContext(req));
  res.json({
    success: true,
    message: 'Profile updated',
    data: user,
    requestId: req.requestId,
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(req.user.id, getReqContext(req));
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Account deleted',
    data: null,
    requestId: req.requestId,
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  getProfile,
  updateProfile,
  deleteAccount,
};