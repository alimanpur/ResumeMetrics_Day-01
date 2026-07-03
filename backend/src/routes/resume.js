const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { uploadResumeSchema, listResumesSchema, deleteResumeSchema } = require('../validators/resume');

// POST /api/v1/resumes/upload
router.post('/upload', authenticate, upload.single('resume'), validate(uploadResumeSchema), resumeController.uploadResume);

// GET /api/v1/resumes
router.get('/', authenticate, validate(listResumesSchema), resumeController.listResumes);

// GET /api/v1/resumes/:id
router.get('/:id', authenticate, resumeController.getResume);

// DELETE /api/v1/resumes/:id
router.delete('/:id', authenticate, validate(deleteResumeSchema), resumeController.deleteResume);

module.exports = router;