
// ============================================
// tenant.guard.ts
// ============================================
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SqlServerService } from '../database/sql-server.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private sql: SqlServerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super admins bypass tenant check
    if (user.userType === 'super_admin' || user.userType === 'owner') {
      return true;
    }

    const tenantId = request.headers['x-tenant-id'] || user.tenantId;

    if (!tenantId) {
      throw new ForbiddenException('Tenant not specified');
    }

    // Check user has access to tenant
    const access = await this.sql.query(
      `SELECT ur.id FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = @userId 
       AND r.tenant_id = @tenantId
       AND ur.is_active = 1`,
      { userId: user.id, tenantId }
    );

    if (access.length === 0) {
      throw new ForbiddenException('Access denied to tenant');
    }

    request.tenantId = tenantId;
    return true;
  }
}