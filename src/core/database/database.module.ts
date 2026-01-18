import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SqlServerService } from './sql-server.service';
import { LoggingService } from './logging.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [SqlServerService, LoggingService],
  exports: [SqlServerService, LoggingService],
})
export class DatabaseModule {}