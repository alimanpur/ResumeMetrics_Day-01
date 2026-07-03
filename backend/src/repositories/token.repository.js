const prisma = require('../lib/prisma');

const refreshTokenCreate = async (args, options = {}) => {
  return prisma.refreshToken.create({
    ...args,
    ...options,
  });
};

const refreshTokenFindUnique = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.refreshToken.findUnique({
    where: where || args,
    ...options,
    ...rest,
  });
};

const refreshTokenUpdate = async (args, options = {}) => {
  return prisma.refreshToken.update({
    ...args,
    ...options,
  });
};

const refreshTokenUpdateMany = async (args) => {
  return prisma.refreshToken.updateMany({
    ...args,
  });
};

const refreshTokenCount = async (args) => {
  const { where, ...rest } = args || {};
  return prisma.refreshToken.count({
    where: where || args,
    ...rest,
  });
};

const passwordResetCreate = async (args, options = {}) => {
  return prisma.passwordReset.create({
    ...args,
    ...options,
  });
};

const passwordResetFindUnique = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.passwordReset.findUnique({
    where: where || args,
    ...options,
    ...rest,
  });
};

const passwordResetUpdate = async (args, options = {}) => {
  return prisma.passwordReset.update({
    ...args,
    ...options,
  });
};

const emailVerificationCreate = async (args, options = {}) => {
  return prisma.emailVerification.create({
    ...args,
    ...options,
  });
};

const emailVerificationFindUnique = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.emailVerification.findUnique({
    where: where || args,
    ...options,
    ...rest,
  });
};

const emailVerificationUpdate = async (args, options = {}) => {
  return prisma.emailVerification.update({
    ...args,
    ...options,
  });
};

const emailVerificationDeleteMany = async (args, options = {}) => {
  return prisma.emailVerification.deleteMany({
    ...args,
    ...options,
  });
};

module.exports = {
  refreshTokenCreate,
  refreshTokenFindUnique,
  refreshTokenUpdate,
  refreshTokenUpdateMany,
  refreshTokenCount,
  passwordResetCreate,
  passwordResetFindUnique,
  passwordResetUpdate,
  emailVerificationCreate,
  emailVerificationFindUnique,
  emailVerificationUpdate,
  emailVerificationDeleteMany,
};
