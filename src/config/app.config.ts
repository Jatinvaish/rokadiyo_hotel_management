
// ============================================
// app.config.ts
// ============================================
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Fluera SaaS',
  version: process.env.APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3060,
  url: process.env.APP_URL || 'http://localhost:3060',
  apiPrefix: process.env.API_PREFIX || 'api',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
}));