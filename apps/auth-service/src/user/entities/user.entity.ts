import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	DEACTIVATED = 'DEACTIVATED',
	PENDING = 'PENDING'
}

@Entity({ database: 'auth' })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: 'phone_number', unique: true })
	phoneNumber: string;

	@Column({ name: 'password_hashed' })
	passwordHashed: string;

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

	@UpdateDateColumn({ name: 'deleted_at' })
	updatedAt: Date;
}
