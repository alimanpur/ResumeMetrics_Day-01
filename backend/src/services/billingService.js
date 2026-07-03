const ApiError = require('../utils/ApiError');
const { createAuditLog } = require('./auditService');
const userRepo = require('../repositories/user.repository');

const getBillingInfo = async (userId) => {
  const user = await userRepo.userFindUnique({
    where: { id: userId },
    include: {
      subscriptions: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const subscription = user.subscriptions || null;

  return {
    subscription: subscription ? {
      id: subscription.id,
      tier: subscription.tier,
      status: subscription.status,
      startsAt: subscription.startsAt,
      endsAt: subscription.endsAt,
    } : {
      tier: 'FREE',
      status: 'active',
      startsAt: new Date(),
      endsAt: null,
    },
    invoices: [],
    paymentMethod: subscription ? {
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
    } : null,
  };
};

const createCheckoutSession = async (userId, data) => {
  // TODO: Integrate with Stripe or payment provider
  // For now, return a placeholder URL
  return {
    url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/billing?success=true`,
  };
};

const getInvoices = async (userId, options = {}) => {
  // No real invoices in this demo
  return {
    invoices: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  };
};

const cancelSubscription = async (userId, reqContext = {}) => {
  const user = await userRepo.userFindUnique({
    where: { id: userId },
    include: {
      subscriptions: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.subscriptions) {
    throw ApiError.badRequest('No active subscription to cancel');
  }

  // TODO: Integrate with Stripe or payment provider
  await createAuditLog({
    userId,
    event: 'SUBSCRIPTION_CANCELLED',
    ip: reqContext.ip,
    requestId: reqContext.requestId,
  });

  return { success: true, message: 'Subscription cancelled successfully' };
};

module.exports = {
  getBillingInfo,
  createCheckoutSession,
  getInvoices,
  cancelSubscription,
};
