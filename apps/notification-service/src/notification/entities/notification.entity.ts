import { NotificationStatus, NotificationType } from "@app/common/enums";
import { INotification } from "@app/common/interfaces";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ database: 'notification' })
export class Notification implements INotification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | undefined;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  status: NotificationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
