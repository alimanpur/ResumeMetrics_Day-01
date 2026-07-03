const pino = require('pino');
const env = require('../config/env');

const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  transport: env.NODE_ENV !== 'production'
    ? {
        target: 'pino/file',
        options: {
          destination: 1,
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
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
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.currentPassword', 'body.newPassword', 'body.token'],
    censor: '[REDACTED]',
  },
});

module.exports = logger;