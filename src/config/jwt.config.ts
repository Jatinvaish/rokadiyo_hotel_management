// ============================================
// jwt.config.ts
// ============================================
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '7d',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
  issuer: process.env.JWT_ISSUER || 'rokadiyo-platform',
  audience: process.env.JWT_AUDIENCE || 'rokadiyo-api',
}));