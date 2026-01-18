import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class SqlServerService implements OnModuleInit {
  private pool: sql.ConnectionPool;
  private readonly logger = new Logger(SqlServerService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      const config = {
        ...this.configService.get('database.sqlServer'),
        options: {
          ...this.configService.get('database.sqlServer.options'),
          enableArithAbort: true,
          trustServerCertificate: process.env.NODE_ENV !== 'production',
          encrypt: process.env.NODE_ENV === 'production',
        }
      };
      
      this.pool = await new sql.ConnectionPool(config).connect();
      this.logger.log('✅ SQL Server connected');
    } catch (error) {
      this.logger.error('❌ SQL Server connection failed', error);
      throw error;
    }
  }

  getPool(): sql.ConnectionPool {
    return this.pool;
  }

  async query<T = any>(queryString: string, params?: any): Promise<T[]> {
    try {
      const request = this.pool.request();
      
      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, this.inferSqlType(params[key]), params[key]);
        });
      }

      const result = await request.query(queryString);
      return Array.isArray(result.recordsets) && result.recordsets.length > 1
        ? result.recordsets as any
        : result.recordset as T[];
    } catch (error) {
      this.logger.error('Query failed', { query: queryString.substring(0, 100), error: error.message });
      throw error;
    }
  }

  async execute(procedureName: string, params?: any): Promise<any> {
    try {
      const request = this.pool.request();
      
      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, this.inferSqlType(params[key]), params[key]);
        });
      }

      const result = await request.execute(procedureName);
      return Array.isArray(result.recordsets) && result.recordsets.length > 1
        ? result.recordsets
        : result.recordset;
    } catch (error) {
      this.logger.error(`SP ${procedureName} failed`, error);
      throw error;
    }
  }

  async transaction(callback: (transaction: sql.Transaction) => Promise<any>): Promise<any> {
    const transaction = new sql.Transaction(this.pool);
    
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Transaction rolled back', error);
      throw error;
    }
  }

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
}