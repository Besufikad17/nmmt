import { UserStatus } from '../enums';
import { CreateUserDto, FindUserDto, UpdateUserDto } from "../dto";

export interface IUser {
	id: string;
	phoneNumber: string;
	email: string;
	passwordHashed: string;
	tokenVersion: number;
	lastLogin?: Date | null;
	status: UserStatus;
	twoFactorEnabled: boolean;
	phoneNumberVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export abstract class IUserService {
	abstract createUser(createUserDto: CreateUserDto): Promise<IUser>;
	abstract findUser(findUserDto: FindUserDto): Promise<IUser | null>;
	abstract updateUser(updateUserDto: UpdateUserDto): Promise<void>;
}
