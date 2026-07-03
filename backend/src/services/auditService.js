const prisma = require('../lib/prisma');

const createAuditLog = async ({ userId, event, ip, requestId }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: event,
        entity: 'auth',
        entityId: userId,
        ipAddress: ip,
        userAgent: requestId,
      },
    });
  } catch (error) {
    // Audit logging should never break the main operation
    console.error('Audit log failed:', error.message);
  }
};

module.exports = { createAuditLog };