const { z } = require('zod');

const uploadResumeSchema = z.object({
  body: z.object({
    metadata: z.string().optional(),
  }),
});

const listResumesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
  }),
});

const deleteResumeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Resume ID is required'),
  }),
});

module.exports = {
  uploadResumeSchema,
  listResumesSchema,
  deleteResumeSchema,
};