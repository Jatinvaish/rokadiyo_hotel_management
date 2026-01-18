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
        origin: process.env.ALLOWED_ORIGINS?.split(','),
        credentials: true,
        methods: ['POST', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Request-ID',
          'X-Tenant-ID',
          'X-Encryption-Enabled',
        ],
      },
    },
  );

  await app.register(multipart as any);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Fluera SaaS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  // Global filters & interceptors
  const db = app.get(SqlServerService);
  const encryption = app.get(EncryptionService);
  const reflector = app.get(Reflector);

  app.useGlobalFilters(new GlobalExceptionFilter(db));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(reflector, encryption),
  );

  // Encryption middleware
  app.getHttpAdapter().getInstance().addHook('preHandler', async (req, reply) => {
    if (req.method === 'OPTIONS') return;

    const encryptionEnabled = req.headers['x-encryption-enabled'] === 'true' ||
      process.env.ENCRYPTION_ENABLED_BY_DEFAULT === 'true';

    if (encryptionEnabled && req.body?.__payload) {
      try {
        const { __payload, __checksum } = req.body;
        const crypto = require('crypto');
        const calculated = crypto.createHash('sha256')
          .update(__payload + process.env.ENCRYPTION_KEY)
          .digest('hex');

        if (calculated !== __checksum) throw new Error('Checksum failed');

        req.body = JSON.parse(encryption.decrypt(__payload));
      } catch (err) {
        reply.code(400).send({ error: 'Decryption failed' });
      }
    }
  });

  await app.listen(process.env.PORT || 3060, '0.0.0.0');
  console.log(`🚀 Server: http://localhost:${process.env.PORT || 3060}`);
}

bootstrap();