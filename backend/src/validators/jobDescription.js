const { z } = require('zod');

const createJobDescriptionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    company: z.string().max(200).optional(),
    content: z.string().min(10, 'Job description content must be at least 10 characters'),
    skills: z.array(z.string()).optional(),
  }),
});

const getJobDescriptionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Job description ID is required'),
  }),
});

const listJobDescriptionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

module.exports = {
  createJobDescriptionSchema,
  getJobDescriptionSchema,
  listJobDescriptionsSchema,
};