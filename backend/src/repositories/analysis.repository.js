const prisma = require('../lib/prisma');

const analysisCreate = async (args, options = {}) => {
  return prisma.analysis.create({
    ...args,
    ...options,
  });
};

const analysisFindFirst = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.analysis.findFirst({
    where: where || args,
    ...options,
    ...rest,
  });
};

const analysisFindMany = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.analysis.findMany({
    where: where || args,
    ...options,
    ...rest,
  });
};

const analysisUpdate = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.analysis.update({
    where: where || args,
    ...rest,
    ...options,
  });
};

const analysisDelete = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.analysis.delete({
    where: where || args,
    ...rest,
    ...options,
  });
};

const analysisCount = async (args) => {
  const { where, ...rest } = args || {};
  return prisma.analysis.count({
    where: where || args,
    ...rest,
  });
};

module.exports = {
  analysisCreate,
  analysisFindFirst,
  analysisFindMany,
  analysisUpdate,
  analysisDelete,
  analysisCount,
};