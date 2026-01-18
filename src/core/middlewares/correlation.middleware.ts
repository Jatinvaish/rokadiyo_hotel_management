// ============================================
// correlation.middleware.ts
// ============================================
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const correlationId = req.headers['x-request-id'] || uuid();
    req['correlationId'] = correlationId;
    res.setHeader('X-Request-ID', correlationId as string);
    next();
  }
}