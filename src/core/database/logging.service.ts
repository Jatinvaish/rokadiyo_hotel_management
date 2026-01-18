import { Injectable } from '@nestjs/common';
import { SqlServerService } from './sql-server.service';

@Injectable()
export class LoggingService {
  constructor(private sql: SqlServerService) {}

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
      await this.sql.execute('sp_CreateActivity', {
        tenant_id: data.tenantId,
        user_id: data.userId,
        activity_type: data.activityType,
        action: data.action,
        subject_type: data.subjectType,
        subject_id: data.subjectId,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      });
    } catch (error) {
      console.error('Activity log failed:', error);
    }
  }

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
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }

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
      });
    } catch (error) {
      console.error('Error log failed:', error);
    }
  }
}