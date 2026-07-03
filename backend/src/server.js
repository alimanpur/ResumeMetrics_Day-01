require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const config = require('./config');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const logger = require('./lib/logger');
const { getAIProvider } = require('./providers/providerFactory');
const prisma = require('./lib/prisma');
const os = require('os');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request ID
app.use(requestId);

// Structured logging with Pino
app.use(pinoHttp({
  logger,
  genReqId: (req) => req.requestId,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      requestId: req.requestId,
      userId: req.user?.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ResumeMetrics API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Enterprise Health endpoint
app.get('/api/health', async (req, res) => {
  const healthData = {
    success: true,
    message: 'Service is healthy',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      environment: config.nodeEnv,
      version: config.app.version,
      requestId: req.requestId,
      checks: {
        database: 'unknown',
        cloudinary: 'unknown',
        email: 'unknown',
        aiProvider: 'unknown',
      },
      system: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        loadAverage: os.loadavg(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
      },
    },
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    healthData.data.checks.database = 'connected';
  } catch {
    healthData.data.checks.database = 'disconnected';
    healthData.data.status = 'degraded';
  }

  // Check AI provider
  try {
    const aiProvider = getAIProvider();
    const aiHealthy = await aiProvider.healthCheck();
    healthData.data.checks.aiProvider = aiHealthy ? 'available' : 'unavailable';
  } catch {
    healthData.data.checks.aiProvider = 'unavailable';
  }

  const statusCode = healthData.data.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Health redirect compatibility (non-versioned)
app.get('/api/v1/health', (req, res) => {
  res.redirect('/api/health');
});

// API routes (v1)
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    requestId: req.requestId,
  });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Warm up database connection
    await prisma.$queryRaw`SELECT 1`;

    // Phase 19 DB bootstrap: add intelligence columns if they don't exist
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'comprehensiveReport') THEN
          ALTER TABLE "analyses" ADD COLUMN "comprehensiveReport" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'executiveSummary') THEN
          ALTER TABLE "analyses" ADD COLUMN "executiveSummary" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'credibilityAnalysis') THEN
          ALTER TABLE "analyses" ADD COLUMN "credibilityAnalysis" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'skillsIntelligence') THEN
          ALTER TABLE "analyses" ADD COLUMN "skillsIntelligence" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'experienceIntelligence') THEN
          ALTER TABLE "analyses" ADD COLUMN "experienceIntelligence" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'projectIntelligence') THEN
          ALTER TABLE "analyses" ADD COLUMN "projectIntelligence" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'interviewPrep') THEN
          ALTER TABLE "analyses" ADD COLUMN "interviewPrep" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'learningRoadmap') THEN
          ALTER TABLE "analyses" ADD COLUMN "learningRoadmap" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'resumeEvolution') THEN
          ALTER TABLE "analyses" ADD COLUMN "resumeEvolution" JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analyses' AND column_name = 'recruiterAnalysis') THEN
          ALTER TABLE "analyses" ADD COLUMN "recruiterAnalysis" JSONB;
        END IF;
      END $$;
    `
    logger.info('Phase 19 DB bootstrap: intelligence columns verified/applied');

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`📚 API Docs: http://localhost:${config.port}/api-docs`);
      logger.info(`❤️  Health: http://localhost:${config.port}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.fatal({ err }, 'UNHANDLED REJECTION! 💥 Shutting down...');
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.fatal({ err }, 'UNCAUGHT EXCEPTION! 💥 Shutting down...');
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server: Database connection failed');
    process.exit(1);
  }
};

startServer();

module.exports = app;