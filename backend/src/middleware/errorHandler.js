const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../lib/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || []);
  }

  error.requestId = req.requestId;

  logger.error({
    err: error,
    requestId: req.requestId,
    userId: req.user?.id,
    method: req.method,
    url: req.originalUrl,
  }, `Error: ${error.message}`);

  const response = error.toJSON();

  if (config.nodeEnv === 'production') {
    delete response.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;