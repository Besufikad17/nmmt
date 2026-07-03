import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { IRefreshToken } from "@app/common/interfaces";

@Entity({ database: 'auth' })
export class RefreshToken implements IRefreshToken {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: 'user_id', type: 'uuid' })
	userId: string;

	@Column({ name: 'refresh_token' })
	refreshToken: string;

	@Column({ name: 'expires_at' })
	expiresAt: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@ManyToOne(() => User, (user) => user.refreshTokens)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
