import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";
import { Notification } from "../entities/notification.entity";

export abstract class INotificationRepository {
  abstract createNotification(createNotificationArgs: DeepPartial<Notification>): Promise<Notification>;
  abstract findNotifications(findNotificationsArgs: FindManyOptions<Notification>): Promise<Notification[]>;
  abstract findNotification(findNotificationArgs: FindOneOptions<Notification>): Promise<Notification | null>;
  abstract updateNotification(updateYserArgs: { where: FindOptionsWhere<Notification>; data: QueryDeepPartialEntity<Notification>; }): Promise<void>;
  abstract deleteNotification(id: string): Promise<void>;
}
