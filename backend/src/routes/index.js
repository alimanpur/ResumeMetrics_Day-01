const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const resumeRoutes = require('./resume');
const analysisRoutes = require('./analysis');
const jobDescriptionRoutes = require('./jobDescription');
const comparisonRoutes = require('./comparison');
const settingsRoutes = require('./settings');
const billingRoutes = require('./billing');

// API v1 routes
router.use('/v1/auth', authRoutes);
router.use('/v1/resumes', resumeRoutes);
router.use('/v1/analyses', analysisRoutes);
router.use('/v1/job-descriptions', jobDescriptionRoutes);
router.use('/v1/comparisons', comparisonRoutes);
router.use('/v1/settings', settingsRoutes);
router.use('/v1/billing', billingRoutes);

module.exports = router;