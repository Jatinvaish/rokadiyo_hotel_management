import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import { EncryptionService } from './core/encryption/encryption.service';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { TenantContextMiddleware } from './core/middlewares/tenant-context.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { GuestsModule } from './modules/guests/guests.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import encryptionConfig from './config/encryption.config';
import jwtConfig from './config/jwt.config';
import r2Config from './config/r2.config';
import { R2Module } from './core/r2/r2.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, encryptionConfig, jwtConfig, r2Config],
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    HotelsModule,
    RoomsModule,
    PricingModule,
    GuestsModule,
    BookingsModule,
    CheckinModule,
    DashboardModule,
    R2Module,
    AccessControlModule,
    SubscriptionsModule,
  ],
  providers: [
    EncryptionService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('*');
  }
}