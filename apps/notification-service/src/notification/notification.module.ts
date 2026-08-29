import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { INotificationRepository } from './interfaces/notification.repository.interface';
import { NotificationRepository } from './repositories/notification.repository';
import { SmsModule } from '../sms/sms.module';
import { Notification } from './entities/notification.entity';
import { DbModule } from '@app/db';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [
    { provide: INotificationRepository, useClass: NotificationRepository },
    NotificationService
  ],
  controllers: [NotificationController],
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
    DbModule.forFeatureTypeORM([Notification], 'notification'),
    SmsModule
  ]
})
export class NotificationModule { }
