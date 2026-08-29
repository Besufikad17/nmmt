import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { INotificationRepository } from '../interfaces';
import { SendNotificationJobData } from '@app/common/interfaces';
import { NotificationStatus, NotificationType } from '@app/common/enums';
import { SmsService } from '../../sms/services/sms.service';

interface NotificationJobResult {
  success: boolean;
}

type NotificationJob = Job<
  SendNotificationJobData,
  NotificationJobResult,
  'notification'
>;

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly smsService: SmsService
  ) {
    super()
  }

  async process(job: NotificationJob): Promise<void> {
    this.logger.debug('Start processing notifications...');
    const { message, type, target } = job.data;

    switch (type) {
      case NotificationType.SMS: {
        await this.smsService.sendMessage({
          message,
          to: target
        });
        break;
      }

      default:
        return;
    }

    this.logger.debug('Notification sent')
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    this.logger.debug('Start completed event...');

    const { id }: SendNotificationJobData = job.data;
    await this.notificationRepository.updateNotification({
      where: { id },
      data: {
        status: NotificationStatus.SENT
      }
    });

    const notification = await this.notificationRepository.findNotification({ where: { id } });
    if (!notification) this.logger.warn('Notificaion not found!!')

    this.logger.debug('Finishing completed event');
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    this.logger.debug('Start failed event...');

    if (job.attemptsMade >= (job.opts.attempts ?? 3)) {
      const { id }: SendNotificationJobData = job.data;
      await this.notificationRepository.updateNotification({
        where: { id },
        data: {
          status: NotificationStatus.FAILED
        }
      });
    }

    this.logger.debug('Finishing completed event');
  }
}
