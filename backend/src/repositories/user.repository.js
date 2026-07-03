const prisma = require('../lib/prisma');

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isEmailVerified: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  subscriptions: {
    select: {
      tier: true,
      status: true,
      endsAt: true,
    },
  },
};

const userFindUnique = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.user.findUnique({
    where: where || args,
    ...options,
    ...rest,
  });
};

const userFindFirst = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.user.findFirst({
    where: where || args,
    ...options,
    ...rest,
  });
};

const userCreate = async (args, options = {}) => {
  return prisma.user.create({
    ...args,
    ...options,
  });
};

const userUpdate = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.user.update({
    where: where || args,
    ...rest,
    ...options,
  });
};

const userDelete = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.user.delete({
    where: where || args,
    ...rest,
    ...options,
  });
};

module.exports = {
  userSelect,
  userFindUnique,
  userFindFirst,
  userCreate,
  userUpdate,
  userDelete,
};