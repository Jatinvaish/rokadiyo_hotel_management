import { Module } from '@nestjs/common'
import { AccessControlController } from '../access-control/access-control.controller'
import { AccessControlService } from '../access-control/access-control.service'
import { AccessControlModule } from '../access-control/access-control.module'

@Module({
  controllers: [AccessControlController],
  providers: [AccessControlService],
  exports: [AccessControlService],
  imports: [AccessControlModule],
})
export class AdminModule {}
