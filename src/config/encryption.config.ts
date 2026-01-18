
// ============================================
// encryption.config.ts
// ============================================
import { registerAs } from '@nestjs/config';

export default registerAs('encryption', () => ({
  key: process.env.ENCRYPTION_KEY,
  algorithm: 'aes-256-gcm',
  enabledByDefault: process.env.ENCRYPTION_ENABLED_BY_DEFAULT === 'true',
}));