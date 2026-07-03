require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./src/config');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const requestId = require('./src/middleware/requestId');
const prisma = require('./src/lib/prisma');

async function start() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected');
    
    const app = express();
    app.use(helmet());
    app.use(cors(config.cors));
    app.use(compression());
    
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: {
        success: false,
        message: 'Too many requests, please try again later.',
      },
    });
    app.use('/api', limiter);
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());
    app.use(requestId);
    
    app.use('/api', routes);
    
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
    
    app.use(errorHandler);
    
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

start();
