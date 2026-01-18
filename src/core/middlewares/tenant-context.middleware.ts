
// ============================================
// tenant-context.middleware.ts
// ============================================
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { SqlServerService } from '../database/sql-server.service';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private sql: SqlServerService) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const request = req as any;

    if (request.user?.id) {
      const tenantId = request.headers['x-tenant-id'] || request.user.tenantId;
      
      if (tenantId) {
        try {
          const tenant = await this.sql.query(
            'SELECT * FROM tenants WHERE id = @tenantId AND is_active = 1',
            { tenantId }
          );
          
          if (tenant.length > 0) {
            request.tenantId = tenant[0].id;
            request.tenant = tenant[0];
          }
        } catch (err) {
          console.error('Tenant context error:', err);
        }
      }
    }
    next();
  }
}
