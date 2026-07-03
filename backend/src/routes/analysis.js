const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAnalysisSchema, getAnalysisSchema, listAnalysesSchema } = require('../validators/analysis');

router.post('/', authenticate, validate(createAnalysisSchema), analysisController.createAnalysis);
router.get('/', authenticate, validate(listAnalysesSchema), analysisController.listAnalyses);
router.get('/stats', authenticate, analysisController.getDashboardStats);
router.get('/resume/:resumeId', authenticate, analysisController.getAnalysisByResume);
router.post('/:id/cancel', authenticate, validate(getAnalysisSchema), analysisController.cancelAnalysis);
router.get('/:id', authenticate, validate(getAnalysisSchema), analysisController.getAnalysis);
router.delete('/:id', authenticate, validate(getAnalysisSchema), analysisController.deleteAnalysis);

router.get('/:id/comprehensive-report', authenticate, validate(getAnalysisSchema), analysisController.getComprehensiveReport);
router.get('/:id/credibility', authenticate, validate(getAnalysisSchema), analysisController.getCredibilityAnalysis);
router.get('/:id/skills-intelligence', authenticate, validate(getAnalysisSchema), analysisController.getSkillsIntelligence);
router.get('/:id/experience', authenticate, validate(getAnalysisSchema), analysisController.getExperienceIntelligence);
router.get('/:id/projects', authenticate, validate(getAnalysisSchema), analysisController.getProjectIntelligence);
router.get('/:id/interview-prep', authenticate, validate(getAnalysisSchema), analysisController.getInterviewPrep);
router.get('/:id/learning-roadmap', authenticate, validate(getAnalysisSchema), analysisController.getLearningRoadmap);

module.exports = router;
