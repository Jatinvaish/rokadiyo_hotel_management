/**
 * Generate a random alphanumeric code
 */
export function generateCode(prefix: string, length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

/**
 * Generate tenant code
 */
export function generateTenantCode(): string {
  return `TNT-${Date.now()}`;
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Sanitize string for SQL
 */
export function sanitizeString(str: string): string {
  return str.replace(/['"\\]/g, '');
}

/**
 * Calculate expiry date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}