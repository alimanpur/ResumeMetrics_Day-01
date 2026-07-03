const asyncHandler = require('../utils/asyncHandler');
const billingService = require('../services/billingService');

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  requestId: req.requestId,
  userId: req.user?.id,
});

const getBillingInfo = asyncHandler(async (req, res) => {
  const info = await billingService.getBillingInfo(req.user.id);
  res.json({
    success: true,
    message: 'Billing info retrieved',
    data: info,
    requestId: req.requestId,
  });
});

const createCheckoutSession = asyncHandler(async (req, res) => {
  const session = await billingService.createCheckoutSession(req.user.id, req.body);
  res.json({
    success: true,
    message: 'Checkout session created',
    data: session,
    requestId: req.requestId,
  });
});

const getInvoices = asyncHandler(async (req, res) => {
  const result = await billingService.getInvoices(req.user.id, req.query);
  res.json({
    success: true,
    message: 'Invoices retrieved',
    data: result.invoices,
    meta: result.pagination,
    requestId: req.requestId,
  });
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const result = await billingService.cancelSubscription(req.user.id, getReqContext(req));
  res.json({
    success: true,
    message: result.message,
    requestId: req.requestId,
  });
});

module.exports = {
  getBillingInfo,
  createCheckoutSession,
  getInvoices,
  cancelSubscription,
};
