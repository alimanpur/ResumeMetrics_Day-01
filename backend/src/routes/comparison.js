const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { authenticate } = require('../middleware/auth');

// POST /api/v1/comparisons
router.post('/', authenticate, comparisonController.createComparison);

// GET /api/v1/comparisons
router.get('/', authenticate, comparisonController.listComparisons);

// GET /api/v1/comparisons/:id
router.get('/:id', authenticate, comparisonController.getComparison);

module.exports = router;