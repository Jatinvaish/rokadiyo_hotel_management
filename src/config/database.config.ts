import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // ============================================
  // PRIMARY DATABASE - SQL Server (Main App Data)
  // ============================================
  sqlServer: {
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'rokadiyo_hotel_mgmt',
    user: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
      enableArithAbort: true,
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      idleTimeoutMillis: 30000,
    },
  },

  // ============================================
  // ANALYTICS DATABASE - SQL Server (Reporting & Analytics)
  // ============================================
  analyticsDb: {
    server: process.env.ANALYTICS_DB_HOST || process.env.DB_HOST || 'localhost',
    database: process.env.ANALYTICS_DB_NAME || 'rokadiyo_analytics',
    user: process.env.ANALYTICS_DB_USER || process.env.DB_USERNAME || 'sa',
    password: process.env.ANALYTICS_DB_PASSWORD || process.env.DB_PASSWORD,
    port: parseInt(process.env.ANALYTICS_DB_PORT || process.env.DB_PORT || '1433'),
    options: {
      encrypt: (process.env.ANALYTICS_DB_ENCRYPT || process.env.DB_ENCRYPT) === 'true',
      trustServerCertificate: (process.env.ANALYTICS_DB_TRUST_CERT || process.env.DB_TRUST_CERT) === 'true',
      enableArithAbort: true,
      connectTimeout: 30000,
      requestTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },

  // ============================================
  // TENANT DATABASE - SQL Server (Per-Tenant Data Isolation)
  // ============================================
  tenantDb: {
    server: process.env.TENANT_DB_HOST || process.env.DB_HOST || 'localhost',
    database: process.env.TENANT_DB_NAME || 'rokadiyo_tenants',
    user: process.env.TENANT_DB_USER || process.env.DB_USERNAME || 'sa',
    password: process.env.TENANT_DB_PASSWORD || process.env.DB_PASSWORD,
    port: parseInt(process.env.TENANT_DB_PORT || process.env.DB_PORT || '1433'),
    options: {
      encrypt: (process.env.TENANT_DB_ENCRYPT || process.env.DB_ENCRYPT) === 'true',
      trustServerCertificate: (process.env.TENANT_DB_TRUST_CERT || process.env.DB_TRUST_CERT) === 'true',
      enableArithAbort: true,
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },

  // ============================================
  // LOGS DATABASE - SQL Server (Audit, Error, Activity Logs)
  // ============================================
  logsDb: {
    server: process.env.LOGS_DB_HOST || process.env.DB_HOST || 'localhost',
    database: process.env.LOGS_DB_NAME || 'rokadiyo_logs',
    user: process.env.LOGS_DB_USER || process.env.DB_USERNAME || 'sa',
    password: process.env.LOGS_DB_PASSWORD || process.env.DB_PASSWORD,
    port: parseInt(process.env.LOGS_DB_PORT || process.env.DB_PORT || '1433'),
    options: {
      encrypt: (process.env.LOGS_DB_ENCRYPT || process.env.DB_ENCRYPT) === 'true',
      trustServerCertificate: (process.env.LOGS_DB_TRUST_CERT || process.env.DB_TRUST_CERT) === 'true',
      enableArithAbort: true,
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
    pool: {
      max: 8,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },

  // ============================================
  // DATABASE CONFIGURATION
  // ============================================
  config: {
    multiDatabase: process.env.MULTI_DATABASE_ENABLED === 'true',
    defaultDatabase: 'sqlServer',
    useReadReplicas: process.env.USE_READ_REPLICAS === 'true',
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY || '5000'),
    logging: process.env.DB_LOGGING === 'true',
  },
}));