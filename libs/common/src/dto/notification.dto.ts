import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NotificationStatus, NotificationType } from "../enums";

export class CreateNotificationDto {
	@IsNotEmpty()
	@IsString()
	readonly target: string;

	@IsString()
	readonly userId?: string;

	@IsNotEmpty()
	@IsEnum(NotificationType)
	readonly type: NotificationType;

	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly message: string;
}

export class UpdateNotificationDto {
	@IsNotEmpty()
	@IsEnum(NotificationStatus)
	readonly status: NotificationStatus;
}
