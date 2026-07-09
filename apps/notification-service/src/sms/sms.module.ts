import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './services/sms.service';
import * as Interface from './interfaces';

@Module({
  providers: [
    { provide: Interface.ISMService, useClass: SmsService },
    SmsService
  ],
  imports: [ConfigModule],
  exports: [Interface.ISMService]
})
export class SmsModule { }
