import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Notification } from '../notification/entities/notification.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.NOTIFICATION_DATABASE_URI,
  entities: [Notification],
  migrations: ['apps/notification-service/src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
