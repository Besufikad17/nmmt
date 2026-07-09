import { validateEnv } from '@app/config';
import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    DbModule.forRoot({
      name: 'notification',
      uri: process.env.AUTH_DATABASE_URI!
    }),
    NotificationModule,
    SmsModule
  ],
})
export class AppModule { }
