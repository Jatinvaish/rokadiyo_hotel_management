import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { SqlServerService } from '../database/sql-server.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private db: SqlServerService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (reply.sent) return;

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
      correlationId: request['correlationId'] || 'unknown',
    };

    this.logger.error(`Error: ${errorResponse.message}`, exception instanceof Error ? exception.stack : '');

    // Log to database
    this.logToDatabase(exception, request, status, errorResponse.message)
      .catch(err => this.logger.error('DB log failed', err));

    reply.status(status).send(errorResponse);
  }

  private async logToDatabase(exception: unknown, request: any, status: number, errorMessage: string) {
    try {
      await this.db.execute('sp_CreateErrorLog', {
        tenant_id: request.tenant?.id || null,
        user_id: request.user?.id || null,
        error_type: exception instanceof Error ? exception.name : 'UnknownError',
        error_message: errorMessage.substring(0, 4000),
        stack_trace: exception instanceof Error ? exception.stack?.substring(0, 4000) : null,
        request_url: request.url,
        request_method: request.method,
        request_body: request.body ? JSON.stringify(request.body).substring(0, 4000) : null,
        severity: status >= 500 ? 'critical' : 'error',
      });
    } catch (err) {
      this.logger.error('Error logging failed', err);
    }
  }
}