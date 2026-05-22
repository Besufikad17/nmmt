import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.AUTH_DATABASE_URI,
  entities: [User],
  migrations: ['apps/auth-service/src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
