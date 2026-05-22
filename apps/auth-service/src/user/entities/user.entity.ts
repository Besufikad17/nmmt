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

	@Column({ unique: true })
	phoneNumber: string;

	@Column()
	passwordHashed: string;

	@Column({ nullable: true })
	lastLogin?: Date;

	@Column({
		type: "enum",
		enum: UserStatus,
		default: UserStatus.PENDING
	})
	status: UserStatus;

	@Column({ default: false })
	twoFactorEnabled: boolean;

	@Column({ default: false })
	phoneNumberVerified: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
