import { Global, Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { UploadController } from './upload.controller';

@Global()
@Module({
  controllers: [UploadController],
  providers: [R2Service],
  exports: [R2Service],
})
export class R2Module { }
