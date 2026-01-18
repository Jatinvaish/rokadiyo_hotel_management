import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import { EncryptionService } from './core/encryption/encryption.service';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { CorrelationMiddleware } from './core/middlewares/correlation.middleware';
import { TenantContextMiddleware } from './core/middlewares/tenant-context.middleware';
import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { TenantsModule } from './modules/tenants/tenants.module';
// import { InvitationsModule } from './modules/invitations/invitations.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import encryptionConfig from './config/encryption.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, encryptionConfig, jwtConfig],
    }),
    DatabaseModule,
    AuthModule,
    // UsersModule,
    // TenantsModule,
    // InvitationsModule,
  ],
  providers: [
    EncryptionService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware, TenantContextMiddleware)
      .forRoutes('*');
  }
}