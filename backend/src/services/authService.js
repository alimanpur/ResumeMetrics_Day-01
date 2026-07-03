const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../lib/email');
const { createAuditLog } = require('./auditService');
const userRepo = require('../repositories/user.repository');
const tokenRepo = require('../repositories/token.repository');
const { UserDTO, AuthDTO, ProfileDTO } = require('../dtos/user.dto');

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const generateRefreshToken = async (userId, replacedTokenHash = null) => {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // If replacing a token, mark the old one as replaced
  if (replacedTokenHash) {
    await tokenRepo.refreshTokenUpdate({
      where: { tokenHash: replacedTokenHash },
      data: { replacedBy: tokenHash },
    });
  }

  await tokenRepo.refreshTokenCreate({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
};

const register = async ({ email, password, name }, reqContext = {}) => {
  // Check if email already exists
  const existing = await userRepo.userFindUnique({ where: { email } });
  
  // If email exists, throw 409 Conflict
  if (existing) {
    throw ApiError.conflict('An account already exists. Please sign in.');
  }
  
  // Email does not exist - Create new user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userRepo.userCreate({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      isEmailVerified: true, // Auto-verify - no email verification
    },
    select: userRepo.userSelect,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  await createAuditLog({
    userId: user.id,
    event: 'REGISTER',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return AuthDTO.fromAuth(user, accessToken, refreshToken);
};

const login = async ({ email, password }, reqContext = {}) => {
  const user = await userRepo.userFindUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  await createAuditLog({
    userId: user.id,
    event: 'LOGIN',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return AuthDTO.fromAuth(user, accessToken, refreshToken);
};

const logout = async (refreshToken, reqContext = {}) => {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await tokenRepo.refreshTokenUpdateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (reqContext.userId) {
      await createAuditLog({
        userId: reqContext.userId,
        event: 'LOGOUT',
        ip: reqContext.ip,
        requestId: reqContext.requestId,
      });
    }
  }
};

const refreshAccessToken = async (refreshToken, reqContext = {}) => {
  const tokenHash = hashToken(refreshToken);
  const stored = await tokenRepo.refreshTokenFindUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, email: true, name: true, role: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  // Revoke old refresh token (rotation)
  await tokenRepo.refreshTokenUpdate({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = generateAccessToken(stored.user.id);
  const newRefreshToken = await generateRefreshToken(stored.user.id, tokenHash);

  await createAuditLog({
    userId: stored.user.id,
    event: 'TOKEN_REFRESH',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return {
    user: stored.user,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const forgotPassword = async (email, reqContext = {}) => {
  const user = await userRepo.userFindUnique({ where: { email } });
  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  await tokenRepo.passwordResetCreate({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  try {
    await sendPasswordResetEmail(user.email, rawToken);
  } catch {
    // Best-effort
  }
};

const resetPassword = async (token, newPassword, reqContext = {}) => {
  const tokenHash = hashToken(token);
  const reset = await tokenRepo.passwordResetFindUnique({ where: { tokenHash } });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const prisma = require('../lib/prisma');
  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await createAuditLog({
    userId: reset.userId,
    event: 'PASSWORD_RESET',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });
};

const verifyEmail = async (token, reqContext = {}) => {
  const tokenHash = hashToken(token);
  const verification = await tokenRepo.emailVerificationFindUnique({ where: { tokenHash } });
  if (!verification || verification.verifiedAt || verification.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired verification token');
  }

  const prisma = require('../lib/prisma');
  await prisma.$transaction([
    prisma.user.update({
      where: { id: verification.userId },
      data: { isEmailVerified: true },
    }),
    prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verifiedAt: new Date() },
    }),
  ]);

  await createAuditLog({
    userId: verification.userId,
    event: 'EMAIL_VERIFIED',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });
};

const changePassword = async (userId, currentPassword, newPassword, reqContext = {}) => {
  const user = await userRepo.userFindUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await userRepo.userUpdate({ where: { id: userId }, data: { password: hashedPassword } });

  await createAuditLog({
    userId,
    event: 'PASSWORD_CHANGE',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });
};

const getProfile = async (userId) => {
  const user = await userRepo.userFindUnique({
    where: { id: userId },
    include: {
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
  return ProfileDTO.fromPrisma(user);
};

const updateProfile = async (userId, data, reqContext = {}) => {
  const user = await userRepo.userUpdate({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isEmailVerified: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      subscriptions: {
        select: {
          tier: true,
          status: true,
          endsAt: true,
        },
      },
    },
  });

  await createAuditLog({
    userId,
    event: 'PROFILE_UPDATE',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return ProfileDTO.fromPrisma(user);
};

const deleteAccount = async (userId, reqContext = {}) => {
  await userRepo.userDelete({ where: { id: userId } });

  await createAuditLog({
    userId,
    event: 'ACCOUNT_DELETED',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  getProfile,
  updateProfile,
  deleteAccount,
  generateAccessToken,
};