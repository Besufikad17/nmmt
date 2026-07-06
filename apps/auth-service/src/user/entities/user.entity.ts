import { IUser } from "@app/common/interfaces";
import { UserStatus } from "@app/common/enums";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { RefreshToken } from "../../refresh-token/entities/refresh-token.entity";

@Entity({ database: 'auth' })
export class User implements IUser {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: 'phone_number', unique: true })
	phoneNumber: string;

	@Column({ name: 'password_hashed' })
	passwordHashed: string;

	@Column({ name: 'token_version', default: 1 })
	tokenVersion: number;

	@Column({ name: 'last_login', nullable: true })
	lastLogin?: Date;

	@Column({
		type: "enum",
		enum: UserStatus,
		default: UserStatus.PENDING
	})
	status: UserStatus;

	@Column({ name: 'two_factor_enabled', default: false })
	twoFactorEnabled: boolean;

	@Column({ name: 'phone_number_verified', default: false })
	phoneNumberVerified: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
	refreshTokens: RefreshToken[];
}
