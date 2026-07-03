const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const createPrismaClient = () => {
  // Ensure DATABASE_URL includes SSL mode for Supabase
  const dbUrl = process.env.DATABASE_URL;
  const hasQueryParams = dbUrl.includes('?');
  const separator = hasQueryParams ? '&' : '?';
  const urlWithSsl = dbUrl.includes('sslmode') ? dbUrl : `${dbUrl}${separator}sslmode=require`;

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: urlWithSsl,
      },
    },
  });
};

// Singleton pattern to prevent multiple Prisma clients
const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

let healthCheckInterval = null;

const startHealthCheck = () => {
  if (healthCheckInterval) return;
  healthCheckInterval = setInterval(async () => {
    const healthy = await healthCheck();
    if (!healthy) {
      console.warn('⚠️ Prisma health check failed, attempting reconnect...');
      await connectWithRetry();
    }
  }, 5 * 60 * 1000); // 5 minutes
};

// Connection health check
const healthCheck = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Prisma health check failed:', error.message);
    return false;
  }
};

// Graceful connection management
const connectWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Prisma connected successfully');
      return true;
    } catch (error) {
      console.error(`❌ Prisma connection attempt ${i + 1}/${retries} failed:`, error.message);
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};

// Graceful shutdown
const shutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Prisma disconnected cleanly');
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
      console.log('🛑 Health check interval cleared');
    }
  } catch (error) {
    console.error('❌ Prisma disconnect error:', error.message);
  }
};

// Process handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await shutdown();
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', async (err) => {
  console.error('❌ Unhandled rejection:', err);
  
  // Handle Prisma connection errors specifically
  if (err.code === 'P1001' || err.message?.includes('connection') || err.code === 10054) {
    console.log('🔄 Attempting to reconnect to database...');
    try {
      await connectWithRetry();
    } catch (reconnectError) {
      console.error('❌ Failed to reconnect after multiple attempts');
    }
  }
});

// Initialize connection on startup
process.nextTick(async () => {
  try {
    await connectWithRetry();
    startHealthCheck(); // Start periodic health check
  } catch (error) {
    console.error('❌ Failed to establish initial database connection');
  }
});

// Export client and utilities
module.exports = prisma;
module.exports.healthCheck = healthCheck;
module.exports.connectWithRetry = connectWithRetry;