const prisma = require('../lib/prisma');

const jdCreate = async (args, options = {}) => {
  return prisma.jobDescription.create({
    ...args,
    ...options,
  });
};

const jdFindFirst = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.jobDescription.findFirst({
    where: where || args,
    ...options,
    ...rest,
  });
};

const jdFindMany = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.jobDescription.findMany({
    where: where || args,
    ...options,
    ...rest,
  });
};

const jdDelete = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.jobDescription.delete({
    where: where || args,
    ...rest,
    ...options,
  });
};

const jdCount = async (args) => {
  const { where, ...rest } = args || {};
  return prisma.jobDescription.count({
    where: where || args,
    ...rest,
  });
};

module.exports = {
  jdCreate,
  jdFindFirst,
  jdFindMany,
  jdDelete,
  jdCount,
};