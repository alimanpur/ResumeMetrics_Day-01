const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/auth');

// GET /api/v1/settings
router.get('/', authenticate, settingsController.getSettings);

// PATCH /api/v1/settings
router.patch('/', authenticate, settingsController.updateSettings);

// PATCH /api/v1/settings/notifications
router.patch('/notifications', authenticate, settingsController.updateNotificationSettings);

// POST /api/v1/settings/password
router.post('/password', authenticate, settingsController.updatePassword);

module.exports = router;
