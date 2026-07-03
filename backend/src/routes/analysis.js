const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAnalysisSchema, getAnalysisSchema, listAnalysesSchema } = require('../validators/analysis');

// POST /api/v1/analyses
router.post('/', authenticate, validate(createAnalysisSchema), analysisController.createAnalysis);

// GET /api/v1/analyses
router.get('/', authenticate, validate(listAnalysesSchema), analysisController.listAnalyses);

// GET /api/v1/analyses/stats
router.get('/stats', authenticate, analysisController.getDashboardStats);

// GET /api/v1/analyses/resume/:resumeId
router.get('/resume/:resumeId', authenticate, analysisController.getAnalysisByResume);

// POST /api/v1/analyses/:id/cancel
router.post('/:id/cancel', authenticate, validate(getAnalysisSchema), analysisController.cancelAnalysis);

// GET /api/v1/analyses/:id
router.get('/:id', authenticate, validate(getAnalysisSchema), analysisController.getAnalysis);

// DELETE /api/v1/analyses/:id
router.delete('/:id', authenticate, validate(getAnalysisSchema), analysisController.deleteAnalysis);

module.exports = router;