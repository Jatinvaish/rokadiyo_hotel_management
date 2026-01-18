import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';
import { Unencrypted } from 'src/core/decorators/unencrypted.decorator';
import { SqlServerService, DatabaseType } from 'src/core/database/sql-server.service';

@ApiTags('Health Check')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private sql: SqlServerService) {}

  @Public()
  @Unencrypted()
  @Get()
  @ApiOperation({ summary: 'Health check - API status' })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Rokadiyo Hotel Management API',
      version: process.env.APP_VERSION || '1.0.0',
    };
  }

  @Public()
  @Unencrypted()
  @Get('databases')
  @ApiOperation({ summary: 'Database connections health check' })
  async databaseHealth() {
    const connections = this.sql.getConnectionsInfo();
    
    const mainInfo = connections[DatabaseType.MAIN] || { connected: false, database: 'N/A', server: 'N/A' };
    const analyticsInfo = connections[DatabaseType.ANALYTICS] || { connected: false, database: 'N/A', server: 'N/A' };
    const tenantInfo = connections[DatabaseType.TENANT] || { connected: false, database: 'N/A', server: 'N/A' };
    const logsInfo = connections[DatabaseType.LOGS] || { connected: false, database: 'N/A', server: 'N/A' };
    
    const health = {
      status: 'ok' as string,
      timestamp: new Date().toISOString(),
      databases: {
        main: mainInfo,
        analytics: analyticsInfo,
        tenant: tenantInfo,
        logs: logsInfo,
      },
      multiDatabaseEnabled: process.env.MULTI_DATABASE_ENABLED === 'true',
    };

    // Set overall status based on main database
    if (!health.databases.main.connected) {
      health.status = 'error';
    } else if (
      process.env.MULTI_DATABASE_ENABLED === 'true' &&
      (!health.databases.logs.connected || !health.databases.analytics.connected)
    ) {
      health.status = 'warning';
    }

    return health;
  }

  @Public()
  @Unencrypted()
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed system health check' })
  async detailedHealth() {
    const connections = this.sql.getConnectionsInfo();
    
    // Test main database connection
    let mainDbTest = false;
    try {
      await this.sql.query('SELECT 1 as test', {}, DatabaseType.MAIN);
      mainDbTest = true;
    } catch (error) {
      mainDbTest = false;
    }

    // Test logs database connection
    let logsDbTest = false;
    try {
      await this.sql.query('SELECT 1 as test', {}, DatabaseType.LOGS);
      logsDbTest = true;
    } catch (error) {
      logsDbTest = false;
    }

    const mainInfo = connections[DatabaseType.MAIN] || { connected: false, database: 'N/A', server: 'N/A' };
    const analyticsInfo = connections[DatabaseType.ANALYTICS] || { connected: false, database: 'N/A', server: 'N/A' };
    const tenantInfo = connections[DatabaseType.TENANT] || { connected: false, database: 'N/A', server: 'N/A' };
    const logsInfo = connections[DatabaseType.LOGS] || { connected: false, database: 'N/A', server: 'N/A' };

    return {
      status: mainDbTest ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      databases: {
        main: {
          ...mainInfo,
          tested: mainDbTest,
        },
        analytics: {
          ...analyticsInfo,
          tested: false,
        },
        tenant: {
          ...tenantInfo,
          tested: false,
        },
        logs: {
          ...logsInfo,
          tested: logsDbTest,
        },
      },
      config: {
        multiDatabaseEnabled: process.env.MULTI_DATABASE_ENABLED === 'true',
        encryptionEnabled: process.env.ENCRYPTION_ENABLED_BY_DEFAULT === 'true',
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
      },
    };
  }
}