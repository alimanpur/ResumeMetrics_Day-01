const { z } = require('zod');

const createAnalysisSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required'),
    jobDescriptionId: z.string().optional(),
  }),
});

const getAnalysisSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Analysis ID is required'),
  }),
});

const listAnalysesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

module.exports = {
  createAnalysisSchema,
  getAnalysisSchema,
  listAnalysesSchema,
};