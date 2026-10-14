import { validateEnv } from '@app/config';
import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { SmsModule } from './sms/sms.module';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST') || 'redis',
          port: config.get('REDIS_PORT') || 6379,
          password: config.get('REDIS_PASSWORD')
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 3000,
          },
          keepLogs: 1,
          lifo: false,
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    DbModule.forRoot({
      name: 'notification',
      uri: process.env.NOTIFICATION_DATABASE_URI!
    }),
    NotificationModule,
    SmsModule,
    MailModule
  ],
})
export class AppModule { }
