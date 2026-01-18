import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqlServerService, DatabaseType } from './sql-server.service';

@Injectable()
export class LoggingService {
  private readonly useLogsDb: boolean;

  constructor(
    private sql: SqlServerService,
    private config: ConfigService,
  ) {
    this.useLogsDb = this.config.get('database.config.multiDatabase') === true;
  }

  /**
   * Get the appropriate database type for logging
   */
  private getLogsDatabase(): DatabaseType {
    return this.useLogsDb && this.sql.isConnected(DatabaseType.LOGS)
      ? DatabaseType.LOGS
      : DatabaseType.MAIN;
  }

  /**
   * Log user activity
   */
  async logActivity(data: {
    tenantId?: number;
    userId: number;
    activityType: string;
    action: string;
    subjectType?: string;
    subjectId?: number;
    description?: string;
    metadata?: any;
  }) {
    try {
      const dbType = this.getLogsDatabase();
      
      await this.sql.execute('sp_CreateActivity', {
        tenant_id: data.tenantId,
        user_id: data.userId,
        activity_type: data.activityType,
        action: data.action,
        subject_type: data.subjectType,
        subject_id: data.subjectId,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      }, dbType);
    } catch (error) {
      console.error('Activity log failed:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Log audit trail (data changes)
   */
  async logAudit(data: {
    tenantId?: number;
    userId?: number;
    entityType: string;
    entityId?: number;
    actionType: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    try {
      const dbType = this.getLogsDatabase();
      
      await this.sql.execute('sp_CreateAuditLog', {
        tenant_id: data.tenantId,
        user_id: data.userId,
        entity_type: data.entityType,
        entity_id: data.entityId,
        action_type: data.actionType,
        old_values: data.oldValues ? JSON.stringify(data.oldValues) : null,
        new_values: data.newValues ? JSON.stringify(data.newValues) : null,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      }, dbType);
    } catch (error) {
      console.error('Audit log failed:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Log errors and exceptions
   */
  async logError(data: {
    tenantId?: number;
    userId?: number;
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
    requestUrl?: string;
    requestMethod?: string;
    requestBody?: any;
    severity?: string;
    metadata?: any;
  }) {
    try {
      const dbType = this.getLogsDatabase();
      
      await this.sql.execute('sp_CreateErrorLog', {
        tenant_id: data.tenantId,
        user_id: data.userId,
        error_type: data.errorType,
        error_message: data.errorMessage.substring(0, 4000),
        stack_trace: data.stackTrace?.substring(0, 4000),
        request_url: data.requestUrl,
        request_method: data.requestMethod,
        request_body: data.requestBody ? JSON.stringify(data.requestBody).substring(0, 4000) : null,
        severity: data.severity || 'error',
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      }, dbType);
    } catch (error) {
      console.error('Error log failed:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Bulk log activities (for batch operations)
   */
  async bulkLogActivities(activities: Array<{
    tenantId?: number;
    userId: number;
    activityType: string;
    action: string;
    subjectType?: string;
    subjectId?: number;
    description?: string;
    metadata?: any;
  }>) {
    try {
      const dbType = this.getLogsDatabase();
      
      const data = activities.map(activity => ({
        tenant_id: activity.tenantId || null,
        user_id: activity.userId,
        activity_type: activity.activityType,
        subject_type: activity.subjectType || null,
        subject_id: activity.subjectId || null,
        action: activity.action,
        description: activity.description || null,
        metadata: activity.metadata ? JSON.stringify(activity.metadata) : null,
        created_at: new Date(),
      }));

      await this.sql.bulkInsert('activities', data, dbType);
    } catch (error) {
      console.error('Bulk activity log failed:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Get activity logs (with pagination)
   */
  async getActivities(params: {
    tenantId?: number;
    userId?: number;
    activityType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const dbType = this.getLogsDatabase();
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    const queryParams: any = { limit, offset };

    if (params.tenantId) {
      whereConditions.push('tenant_id = @tenantId');
      queryParams.tenantId = params.tenantId;
    }
    if (params.userId) {
      whereConditions.push('user_id = @userId');
      queryParams.userId = params.userId;
    }
    if (params.activityType) {
      whereConditions.push('activity_type = @activityType');
      queryParams.activityType = params.activityType;
    }
    if (params.startDate) {
      whereConditions.push('created_at >= @startDate');
      queryParams.startDate = params.startDate;
    }
    if (params.endDate) {
      whereConditions.push('created_at <= @endDate');
      queryParams.endDate = params.endDate;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT * FROM activities
      ${whereClause}
      ORDER BY created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM activities ${whereClause}
    `;

    const [data, count] = await Promise.all([
      this.sql.query(query, queryParams, dbType),
      this.sql.query(countQuery, queryParams, dbType),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: count[0]?.total || 0,
        totalPages: Math.ceil((count[0]?.total || 0) / limit),
      },
    };
  }

  /**
   * Get error logs (with pagination)
   */
  async getErrors(params: {
    tenantId?: number;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const dbType = this.getLogsDatabase();
    const page = params.page || 1;
    const limit = params.limit || 50;
    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    const queryParams: any = { limit, offset };

    if (params.tenantId) {
      whereConditions.push('tenant_id = @tenantId');
      queryParams.tenantId = params.tenantId;
    }
    if (params.severity) {
      whereConditions.push('severity = @severity');
      queryParams.severity = params.severity;
    }
    if (params.startDate) {
      whereConditions.push('created_at >= @startDate');
      queryParams.startDate = params.startDate;
    }
    if (params.endDate) {
      whereConditions.push('created_at <= @endDate');
      queryParams.endDate = params.endDate;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT * FROM error_logs
      ${whereClause}
      ORDER BY created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM error_logs ${whereClause}
    `;

    const [data, count] = await Promise.all([
      this.sql.query(query, queryParams, dbType),
      this.sql.query(countQuery, queryParams, dbType),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: count[0]?.total || 0,
        totalPages: Math.ceil((count[0]?.total || 0) / limit),
      },
    };
  }
}