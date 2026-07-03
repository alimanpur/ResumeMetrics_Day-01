const prisma = require('../lib/prisma');

const comparisonCreate = async (args, options = {}) => {
  return prisma.comparison.create({
    ...args,
    ...options,
  });
};

const comparisonFindFirst = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.comparison.findFirst({
    where: where || args,
    ...options,
    ...rest,
  });
};

const comparisonFindMany = async (args, options = {}) => {
  const { where, ...rest } = args || {};
  return prisma.comparison.findMany({
    where: where || args,
    ...options,
    ...rest,
  });
};

const comparisonCount = async (args) => {
  const { where, ...rest } = args || {};
  return prisma.comparison.count({
    where: where || args,
    ...rest,
  });
};

module.exports = {
  comparisonCreate,
  comparisonFindFirst,
  comparisonFindMany,
  comparisonCount,
};