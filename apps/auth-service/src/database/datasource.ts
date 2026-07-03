import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.AUTH_DATABASE_URI,
  entities: [User, RefreshToken],
  migrations: ['apps/auth-service/src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
