const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require('../validators/auth');

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// POST /api/v1/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// GET /api/v1/auth/verify-email
router.get('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

// POST /api/v1/auth/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

// GET /api/v1/auth/profile
router.get('/profile', authenticate, authController.getProfile);

// PATCH /api/v1/auth/profile
router.patch('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

// DELETE /api/v1/auth/account
router.delete('/account', authenticate, authController.deleteAccount);

module.exports = router;