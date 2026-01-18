import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

export enum DatabaseType {
  MAIN = 'sqlServer',
  ANALYTICS = 'analyticsDb',
  TENANT = 'tenantDb',
  LOGS = 'logsDb',
}

export interface DatabaseConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  port: number;
  options: any;
  pool: any;
}

export interface PoolInfo {
  connected: boolean;
  database: string;
  server: string;
}

@Injectable()
export class SqlServerService implements OnModuleInit {
  private pools: Map<DatabaseType, sql.ConnectionPool> = new Map();
  private configs: Map<DatabaseType, DatabaseConfig> = new Map();
  private readonly logger = new Logger(SqlServerService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connectAll();
  }

  /**
   * Connect to all configured databases
   */
  private async connectAll() {
    const multiDbEnabled = this.configService.get('database.config.multiDatabase');

    // Always connect to main database
    await this.connectDatabase(DatabaseType.MAIN);

    // Connect to other databases if multi-database mode is enabled
    if (multiDbEnabled) {
      await this.connectDatabase(DatabaseType.ANALYTICS);
      await this.connectDatabase(DatabaseType.TENANT);
      await this.connectDatabase(DatabaseType.LOGS);
    }
  }

  /**
   * Connect to a specific database
   */
  private async connectDatabase(dbType: DatabaseType) {
    try {
      const dbConfig = this.configService.get<DatabaseConfig>(`database.${dbType}`);
      
      if (!dbConfig) {
        this.logger.warn(`⚠️  Database config not found for: ${dbType}`);
        return;
      }

      const config: sql.config = {
        ...dbConfig,
        options: {
          ...dbConfig.options,
          enableArithAbort: true,
          trustServerCertificate: process.env.NODE_ENV !== 'production',
          encrypt: process.env.NODE_ENV === 'production',
        }
      };
      
      const pool = await new sql.ConnectionPool(config).connect();
      this.pools.set(dbType, pool);
      this.configs.set(dbType, dbConfig);
      
      this.logger.log(`✅ ${dbType} database connected: ${dbConfig.database}`);
    } catch (error: any) {
      this.logger.error(`❌ ${dbType} database connection failed`, error.message);
      
      // Retry logic
      const retryAttempts = this.configService.get<number>('database.config.retryAttempts') || 3;
      const retryDelay = this.configService.get<number>('database.config.retryDelay') || 5000;
      
      for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        this.logger.log(`🔄 Retrying ${dbType} connection (${attempt}/${retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        try {
          const dbConfig = this.configService.get<DatabaseConfig>(`database.${dbType}`);
          if (!dbConfig) continue;
          
          const config: sql.config = {
            ...dbConfig,
            options: {
              ...dbConfig.options,
              enableArithAbort: true,
              trustServerCertificate: process.env.NODE_ENV !== 'production',
              encrypt: process.env.NODE_ENV === 'production',
            }
          };
          
          const pool = await new sql.ConnectionPool(config).connect();
          this.pools.set(dbType, pool);
          this.configs.set(dbType, dbConfig);
          this.logger.log(`✅ ${dbType} database connected on retry ${attempt}`);
          return;
        } catch (retryError) {
          this.logger.warn(`Retry ${attempt} failed for ${dbType}`);
        }
      }
      
      // If main database fails, throw error
      if (dbType === DatabaseType.MAIN) {
        throw new Error(`Failed to connect to main database after ${retryAttempts} attempts`);
      }
    }
  }

  /**
   * Get connection pool for specific database
   */
  getPool(dbType: DatabaseType = DatabaseType.MAIN): sql.ConnectionPool {
    const pool = this.pools.get(dbType);
    
    if (!pool) {
      this.logger.warn(`Pool not found for ${dbType}, using main database`);
      return this.pools.get(DatabaseType.MAIN)!;
    }
    
    return pool;
  }

  /**
   * Execute a query on specific database
   */
  async query<T = any>(
    queryString: string, 
    params?: any, 
    dbType: DatabaseType = DatabaseType.MAIN
  ): Promise<T[]> {
    try {
      const pool = this.getPool(dbType);
      const request = pool.request();
      
      if (params) {
        Object.keys(params).forEach((key) => {
          const value = params[key];
          
          // Validate and sanitize parameters
          if (value !== null && value !== undefined) {
            request.input(key, this.inferSqlType(value), value);
          } else {
            request.input(key, sql.NVarChar, null);
          }
        });
      }

      const result = await request.query(queryString);
      
      if (Array.isArray(result.recordsets) && result.recordsets.length > 1) {
        return result.recordsets as any;
      }
      
      return result.recordset as T[];
    } catch (error: any) {
      this.logger.error(`Query failed on ${dbType}`, { 
        query: queryString.substring(0, 100), 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Execute stored procedure on specific database
   */
  async execute(
    procedureName: string, 
    params?: any, 
    dbType: DatabaseType = DatabaseType.MAIN
  ): Promise<any> {
    try {
      const pool = this.getPool(dbType);
      const request = pool.request();
      
      if (params) {
        Object.keys(params).forEach((key) => {
          const value = params[key];
          request.input(key, this.inferSqlType(value), value);
        });
      }

      const result = await request.execute(procedureName);
      
      if (Array.isArray(result.recordsets) && result.recordsets.length > 1) {
        return result.recordsets;
      }
      
      return result.recordset;
    } catch (error: any) {
      this.logger.error(`SP ${procedureName} failed on ${dbType}`, error.message);
      throw error;
    }
  }

  /**
   * Execute transaction on specific database
   */
  async transaction(
    callback: (transaction: sql.Transaction) => Promise<any>,
    dbType: DatabaseType = DatabaseType.MAIN
  ): Promise<any> {
    const pool = this.getPool(dbType);
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error(`Transaction rolled back on ${dbType}`, error.message);
      throw error;
    }
  }

  /**
   * Execute bulk insert on specific database
   */
  async bulkInsert(
    tableName: string,
    data: any[],
    dbType: DatabaseType = DatabaseType.MAIN
  ): Promise<void> {
    if (!data || data.length === 0) return;

    const pool = this.getPool(dbType);
    const table = new sql.Table(tableName);

    // Infer columns from first row
    const firstRow = data[0];
    Object.keys(firstRow).forEach(key => {
      const value = firstRow[key];
      table.columns.add(key, this.inferSqlType(value));
    });

    // Add rows
    data.forEach(row => {
      const values:any = Object.values(row);
      table.rows.add(...values);
    });

    try {
      const request = pool.request();
      await request.bulk(table);
      this.logger.log(`Bulk insert: ${data.length} rows into ${tableName} on ${dbType}`);
    } catch (error: any) {
      this.logger.error(`Bulk insert failed on ${dbType}`, error.message);
      throw error;
    }
  }

  /**
   * Check if database is connected
   */
  isConnected(dbType: DatabaseType = DatabaseType.MAIN): boolean {
    const pool = this.pools.get(dbType);
    return pool?.connected || false;
  }

  /**
   * Get all connected databases info
   */
  getConnectionsInfo(): Record<string, PoolInfo> {
    const info: Record<string, PoolInfo> = {};
    this.pools.forEach((pool, dbType) => {
      const config = this.configs.get(dbType);
      info[dbType] = {
        connected: pool.connected,
        database: config?.database || 'unknown',
        server: config?.server || 'unknown',
      };
    });
    return info;
  }

  /**
   * Close all database connections
   */
  async closeAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.pools.forEach((pool, dbType) => {
      this.logger.log(`Closing ${dbType} connection...`);
      promises.push(pool.close());
    });
    await Promise.all(promises);
    this.pools.clear();
    this.configs.clear();
    this.logger.log('All database connections closed');
  }

  /**
   * Infer SQL type to prevent type coercion attacks
   */
  private inferSqlType(value: any): any {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? sql.BigInt : sql.Decimal(18, 2);
    }
    if (typeof value === 'boolean') return sql.Bit;
    if (value instanceof Date) return sql.DateTime2;
    if (typeof value === 'string') {
      return value.length > 4000 ? sql.NVarChar(sql.MAX) : sql.NVarChar(4000);
    }
    return sql.NVarChar(sql.MAX);
  }

  /**
   * Safe query builder for dynamic WHERE clauses
   */
  buildSafeWhereClause(conditions: Record<string, any>): { whereClause: string; params: any } {
    const whereParts: string[] = [];
    const params: any = {};

    Object.entries(conditions).forEach(([key, value], index) => {
      const paramName = `param${index}`;
      whereParts.push(`${key} = @${paramName}`);
      params[paramName] = value;
    });

    return {
      whereClause: whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '',
      params,
    };
  }
}