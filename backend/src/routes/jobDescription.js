const express = require('express');
const router = express.Router();
const jdController = require('../controllers/jobDescriptionController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createJobDescriptionSchema, getJobDescriptionSchema, listJobDescriptionsSchema } = require('../validators/jobDescription');

// POST /api/v1/job-descriptions
router.post('/', authenticate, validate(createJobDescriptionSchema), jdController.createJobDescription);

// GET /api/v1/job-descriptions
router.get('/', authenticate, validate(listJobDescriptionsSchema), jdController.listJobDescriptions);

// GET /api/v1/job-descriptions/:id
router.get('/:id', authenticate, validate(getJobDescriptionSchema), jdController.getJobDescription);

// DELETE /api/v1/job-descriptions/:id
router.delete('/:id', authenticate, validate(getJobDescriptionSchema), jdController.deleteJobDescription);

module.exports = router;