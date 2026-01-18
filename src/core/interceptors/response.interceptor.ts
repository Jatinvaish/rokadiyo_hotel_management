import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private encryption: EncryptionService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const reply = context.switchToHttp().getResponse();
    const isUnencrypted = this.reflector.get<boolean>('unencrypted', context.getHandler());

    return next.handle().pipe(
      map((data) => {
        const response = {
          success: true,
          statusCode: reply.statusCode || 200,
          message: data?.message || 'Success',
          data: data?.data !== undefined ? data.data : data,
          timestamp: new Date().toISOString(),
          correlationId: request.correlationId || 'unknown',
        };

        // Add pagination if exists
        if (data?.pagination) {
          response['pagination'] = data.pagination;
        }

        if (isUnencrypted) return response;

        const encrypted = this.encryption.encrypt(JSON.stringify(response));
        const checksum = this.encryption.hash(encrypted + process.env.ENCRYPTION_KEY);

        reply.header('X-Encryption-Enabled', 'true');

        return {
          __payload: encrypted,
          __checksum: checksum,
          __ts: Date.now(),
        };
      }),
    );
  }
}