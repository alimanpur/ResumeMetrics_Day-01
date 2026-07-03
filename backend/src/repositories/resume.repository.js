const prisma = require('../lib/prisma');

const resumeCreate = async (args, options = {}) => {
  return prisma.resume.create({
    ...args,
    ...options,
  });
};

const resumeFindFirst = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.resume.findFirst({
    where: where || args,
    ...options,
    ...rest,
  });
};

const resumeFindMany = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.resume.findMany({
    where: where || args,
    ...options,
    ...rest,
  });
};

const resumeUpdate = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.resume.update({
    where: where || args,
    ...rest,
    ...options,
  });
};

const resumeCount = async (args) => {
  const { where, ...rest } = args || {};
  return prisma.resume.count({
    where: where || args,
    ...rest,
  });
};

const getLatestAnalysisScore = async (userId) => {
  const latestAnalysis = await prisma.analysis.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { atsScore: true },
  });
  return latestAnalysis?.atsScore || 0;
};

module.exports = {
  resumeCreate,
  resumeFindFirst,
  resumeFindMany,
  resumeUpdate,
  resumeCount,
  getLatestAnalysisScore,
};