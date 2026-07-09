import { CreateNotificationDto, UpdateNotificationDto } from "../dto";
import { NotificationStatus, NotificationType } from "../enums";

export interface INotification {
	id: string;
	userId?: string;
	type: NotificationType;
	title: string;
	message: string;
	status: NotificationStatus;
	createdAt: Date;
	updatedAt: Date;
}

export abstract class INotificationService {
	abstract createNotification(dto: CreateNotificationDto): Promise<void>;
	abstract updateNotification(id: string, dto: UpdateNotificationDto): Promise<void>;
}
