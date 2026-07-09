import { OtpChannel, OtpPurpose } from "@app/common/enums";
import { IOtp } from "@app/common/interfaces";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({ database: 'auth' })
export class Otp implements IOtp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  hash: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | undefined;

  @Column({ default: false })
  used: boolean;

  @Column()
  target: string;

  @Column({ type: 'enum', enum: OtpChannel })
  channel: OtpChannel;

  @Column({ type: 'enum', enum: OtpPurpose })
  purpose: OtpPurpose;

  @Column({ default: 0 })
  attempts: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
