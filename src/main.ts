import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters/exception.filter';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { EncryptionService } from './core/encryption/encryption.service';
import { SqlServerService } from './core/database/sql-server.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Tenant-ID',
          'X-Encryption-Enabled',
        ],
      },
    },
  );

  await app.register(multipart as any);

  // Global prefix and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ 
    type: VersioningType.URI, 
    defaultVersion: '1' 
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Rokadiyo Hotel Management API')
    .setDescription('Multi-tenant Hotel Management SaaS Platform with AES-256-GCM Encryption')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3060', 'Development')
    .addServer('https://api.rokadiyo.com', 'Production')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get services for global usage
  const db = app.get(SqlServerService);
  const encryption = app.get(EncryptionService);
  const reflector = app.get(Reflector);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(db));

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(reflector, encryption),
  );

  // Encryption middleware - Auto decrypt encrypted requests
  app.getHttpAdapter().getInstance().addHook('preHandler', async (req: any, reply: any) => {
    if (req.method === 'OPTIONS') return;

    const encryptionEnabled = req.headers['x-encryption-enabled'] === 'true' ||
      process.env.ENCRYPTION_ENABLED_BY_DEFAULT === 'true';

    if (encryptionEnabled && req.body && typeof req.body === 'object' && '__payload' in req.body) {
      try {
        const { __payload, __checksum } = req.body as { __payload: string; __checksum: string };
        const crypto = require('crypto');
        const calculated = crypto.createHash('sha256')
          .update(__payload + process.env.ENCRYPTION_KEY)
          .digest('hex');

        if (calculated !== __checksum) {
          throw new Error('Checksum verification failed');
        }

        req.body = JSON.parse(encryption.decrypt(__payload));
      } catch (err: any) {
        reply.code(400).send({ 
          success: false,
          statusCode: 400,
          message: 'Request decryption failed',
          error: err.message 
        });
      }
    }
  });

  const port = process.env.PORT || 3060;
  await app.listen(port, '0.0.0.0');
  
  console.log(`
╔══════════════════════════════════════════════╗
║   🚀 Rokadiyo Hotel Management Platform      ║
╠══════════════════════════════════════════════╣
║   🌐 Server: http://localhost:${port}          ║
║   📚 API Docs: http://localhost:${port}/api/docs
║   🔒 Encryption: AES-256-GCM (Default ON)    ║
║   🔑 JWT: Encrypted Payload                  ║
║   📊 Versioning: URI-based (v1)              ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                 ║
╚══════════════════════════════════════════════╝

✅ Super Admin: admin@rokadiyo.com / Admin@123
  `);
}

bootstrap();