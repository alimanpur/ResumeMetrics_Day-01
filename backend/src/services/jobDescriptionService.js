const ApiError = require('../utils/ApiError');
const jdRepo = require('../repositories/jobDescription.repository');
const { JobDescriptionDTO } = require('../dtos/jobDescription.dto');

const createJobDescription = async (userId, data) => {
  const jobDescription = await jdRepo.jdCreate({
    data: {
      userId,
      title: data.title || 'Untitled',
      company: data.company || null,
      content: data.content || '',
      skills: data.skills || null,
      status: 'active',
    },
  });
  return JobDescriptionDTO.fromPrisma(jobDescription);
};

const getJobDescription = async (userId, id) => {
  const jobDescription = await jdRepo.jdFindFirst({
    where: { id, userId },
  });

  if (!jobDescription) {
    throw ApiError.notFound('Job description not found');
  }

  return JobDescriptionDTO.fromPrisma(jobDescription);
};

const listJobDescriptions = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [jobDescriptions, total] = await Promise.all([
    jdRepo.jdFindMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    jdRepo.jdCount({ where: { userId } }),
  ]);

  return {
    jobDescriptions: JobDescriptionDTO.fromPrismaArray(jobDescriptions),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const deleteJobDescription = async (userId, id) => {
  const jobDescription = await jdRepo.jdFindFirst({
    where: { id, userId },
  });

  if (!jobDescription) {
    throw ApiError.notFound('Job description not found');
  }

  await jdRepo.jdDelete({ where: { id } });
};

module.exports = {
  createJobDescription,
  getJobDescription,
  listJobDescriptions,
  deleteJobDescription,
};