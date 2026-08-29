import { INotificationService } from '@app/common/interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../interfaces/notification.repository.interface';
import { CreateNotificationDto, UpdateNotificationDto } from '@app/common/dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    @InjectQueue('notification') private readonly notificationQueue: Queue
  ) { }

  async createNotification(dto: CreateNotificationDto): Promise<void> {
    try {
      const notification = await this.notificationRepository.createNotification({ ...dto });

      await this.notificationQueue.add(
        'new',
        {
          id: notification.id,
          ...dto,
        },
        {
          removeOnComplete: true,
          removeOnFail: {
            age: 3600
          }
        }
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async updateNotification(id: string, dto: UpdateNotificationDto): Promise<void> {
    try {
      await this.notificationRepository.updateNotification({
        where: { id },
        data: { ...dto }
      });
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
