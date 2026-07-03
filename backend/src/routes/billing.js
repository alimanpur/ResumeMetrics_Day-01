const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticate } = require('../middleware/auth');

// GET /api/v1/billing
router.get('/', authenticate, billingController.getBillingInfo);

// POST /api/v1/billing/checkout
router.post('/checkout', authenticate, billingController.createCheckoutSession);

// GET /api/v1/billing/invoices
router.get('/invoices', authenticate, billingController.getInvoices);

// POST /api/v1/billing/cancel
router.post('/cancel', authenticate, billingController.cancelSubscription);

module.exports = router;
