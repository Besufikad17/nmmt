import { Controller } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateNotificationDto } from '@app/common/dto';

@Controller('notification')
export class NotificationController {
  constructor(
    private service: NotificationService
  ) { }

  @MessagePattern({ cmd: 'createNotification' })
  async createNotification(dto: CreateNotificationDto) {
    return await this.service.createNotification(dto);
  }
}
