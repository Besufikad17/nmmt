import { FindOneOptions } from 'typeorm';
import { UserStatus } from '../enums';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID, ValidateIf } from 'class-validator';
import { User } from 'apps/auth-service/src/user/entities/user.entity';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly phoneNumber: string;

	@IsString()
	@IsNotEmpty()
	readonly email: string;

	@IsString()
	@IsNotEmpty()
	readonly password: string;
}

export class UpdateUserDto {
	@IsNotEmpty()
	@IsUUID()
	readonly id: string;

	@IsString()
	@ValidateIf((obj) => obj.phoneNumber !== undefined && obj.phoneNumber !== null && obj.phoneNumber !== '')
	readonly phoneNumber?: string;

	@IsString()
	@ValidateIf((obj) => obj.email !== undefined && obj.email !== null && obj.email !== '')
	readonly email?: string;

	@IsString()
	@ValidateIf((obj) => obj.passwordHash !== undefined && obj.passwordHash !== null && obj.passwordHash !== '')
	readonly passwordHashed?: string;

	@IsDate()
	@ValidateIf((obj) => obj.lastLogin !== undefined && obj.lastLogin !== null && obj.lastLogin !== '')
	readonly lastLogin?: Date;

	@IsBoolean()
	@ValidateIf((obj) => obj.phoneNumberVerified !== undefined && obj.phoneNumberVerified !== null && obj.phoneNumberVerified !== '')
	readonly phoneNumberVerified?: boolean;

	@IsEnum(UserStatus)
	@ValidateIf((obj) => obj.status !== undefined && obj.status !== null && obj.status !== '')
	readonly status?: UserStatus;

	@IsBoolean()
	@ValidateIf((obj) => obj.twoFactorEnabled !== undefined && obj.twoFactorEnabled !== null && obj.twoFactorEnabled !== '')
	readonly twoFactorEnabled?: boolean;

	@IsNumber()
	@ValidateIf((obj) => obj.tokenVersion !== undefined && obj.tokenVersion !== null && obj.tokenVersion !== "")
	readonly tokenVersion?: number;
}

export class FindUserDto implements FindOneOptions<User> {
	[key: string]: any;
}

export class FindUsersDto {
	@IsEnum(UserStatus)
	@ValidateIf((obj) => obj.status !== undefined && obj.status !== null && obj.status !== '')
	readonly status?: UserStatus;

	@IsString()
	@ValidateIf((obj) => obj.text !== undefined && obj.text !== null && obj.text !== '')
	readonly text?: string;

	@IsNumber()
	@ValidateIf((obj) => obj.skip !== undefined && obj.skip !== null && obj.skip !== '')
	readonly skip?: number;

	@IsNumber()
	@ValidateIf((obj) => obj.take !== undefined && obj.take !== null && obj.take !== '')
	readonly take?: number;

	@IsObject()
	@ValidateIf((obj) => obj.sortOptions !== undefined && obj.sortOptions !== null && obj.sortOptions !== '')
	readonly sortOptions?: Object;

	@IsBoolean()
	@ValidateIf((obj) => obj.twoFactorEnabled !== undefined && obj.twoFactorEnabled !== null && obj.twoFactorEnabled !== '')
	readonly twoFactorEnabled?: boolean;
}
