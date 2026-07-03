const ApiError = require('../utils/ApiError');
const { createAuditLog } = require('./auditService');
const userRepo = require('../repositories/user.repository');
const { ProfileDTO } = require('../dtos/user.dto');

const getSettings = async (userId) => {
  const user = await userRepo.userFindUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isEmailVerified: true,
      avatarUrl: true,
      themePreference: true,
      notificationPreferences: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        select: {
          tier: true,
          status: true,
          endsAt: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    avatarUrl: user.avatarUrl,
    themePreference: user.themePreference,
    notificationPreferences: user.notificationPreferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    subscription: user.subscriptions?.[0] || { tier: 'FREE', status: 'active' },
  };
};

const updateSettings = async (userId, data, reqContext = {}) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.themePreference !== undefined) updateData.themePreference = data.themePreference;
  if (data.notificationPreferences !== undefined) updateData.notificationPreferences = data.notificationPreferences;

  const user = await userRepo.userUpdate({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isEmailVerified: true,
      avatarUrl: true,
      themePreference: true,
      notificationPreferences: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await createAuditLog({
    userId,
    event: 'SETTINGS_UPDATE',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    avatarUrl: user.avatarUrl,
    themePreference: user.themePreference,
    notificationPreferences: user.notificationPreferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updatePassword = async (userId, newPassword, reqContext = {}) => {
  const hashedPassword = await require('bcryptjs').hash(newPassword, 12);
  await userRepo.userUpdate({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await createAuditLog({
    userId,
    event: 'PASSWORD_CHANGE',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });
};

module.exports = {
  getSettings,
  updateSettings,
  updatePassword,
};
