import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "../entities/notification.entity";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity, Repository } from "typeorm";
import { INotificationRepository } from "../interfaces/notification.repository.interface";

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification, 'auth') private readonly notificationRepository: Repository<Notification>
  ) { }

  async createNotification(createNotificationArgs: DeepPartial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationArgs);
    const savedNotification = await this.notificationRepository.save(notification);
    return (Array.isArray(savedNotification) ? savedNotification[0] : savedNotification) as Notification;
  }

  async findNotifications(findNotificationsArgs: FindManyOptions<Notification>): Promise<Notification[]> {
    return this.notificationRepository.find(findNotificationsArgs);
  }

  async findNotification(findNotificationArgs: FindOneOptions<Notification>): Promise<Notification | null> {
    return this.notificationRepository.findOne(findNotificationArgs);
  }

  async updateNotification(updateYserArgs: { where: FindOptionsWhere<Notification>; data: QueryDeepPartialEntity<Notification>; }): Promise<void> {
    this.notificationRepository.update(updateYserArgs.where, updateYserArgs.data);
  }

  async deleteNotification(id: string): Promise<void> {
    this.notificationRepository.delete(id);
  }
}
