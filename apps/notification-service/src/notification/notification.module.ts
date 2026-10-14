import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { INotificationRepository } from './interfaces/notification.repository.interface';
import { NotificationRepository } from './repositories/notification.repository';
import { SmsModule } from '../sms/sms.module';
import { Notification } from './entities/notification.entity';
import { DbModule } from '@app/db';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './processors/notification.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [
    { provide: INotificationRepository, useClass: NotificationRepository },
    NotificationService,
    NotificationProcessor
  ],
  controllers: [NotificationController],
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
    DbModule.forFeatureTypeORM([Notification], 'notification'),
    MailModule,
    SmsModule
  ]
})
export class NotificationModule { }
