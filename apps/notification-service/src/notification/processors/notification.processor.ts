import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { INotificationRepository } from '../interfaces';
import { SendNotificationJobData } from '@app/common/interfaces';
import { NotificationStatus, NotificationType } from '@app/common/enums';
import { ISMService } from '../../sms/interfaces';
import { IMailService } from '../../mail/interfaces';
import { getEmailHtml } from '@app/common/utils/mail.utils';

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
    @Inject(IMailService) private readonly mailService: IMailService,
    @Inject(ISMService) private readonly smsService: ISMService
  ) {
    super()
  }

  async process(job: NotificationJob): Promise<void> {
    this.logger.debug('Start processing notifications...');
    const { message, title, type, target } = job.data;

    switch (type) {
      case NotificationType.SMS: {
        await this.smsService.sendMessage({
          message,
          to: target
        });
        break;
      }
      case NotificationType.EMAIL: {
        await this.mailService.sendEmail({
          to: target,
          subject: title,
          body: message,
          html: getEmailHtml(message)
        });
        break;
      }
      default:
        throw new Error(`Unsupported notification type: ${type}`);
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
