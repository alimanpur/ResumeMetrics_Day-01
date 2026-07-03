const env = require('./env');

const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  clientUrl: env.CLIENT_URL,

  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES || '15m',
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES || '7d',
  },

  supabase: {
    url: env.SUPABASE_URL,
    key: env.SUPABASE_KEY,
  },

  cloudinary: {
    cloudName: env.CLOUDINARY_NAME,
    apiKey: env.CLOUDINARY_KEY,
    apiSecret: env.CLOUDINARY_SECRET,
  },

  email: {
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT, 10),
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
  },

  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 500,
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedMimes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  app: {
    name: 'ResumeMetrics',
    version: '1.0.0',
  },
};

module.exports = config;