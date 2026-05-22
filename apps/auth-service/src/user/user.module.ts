import { Module } from '@nestjs/common';
import { DbModule } from 'lib/db';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import * as Interface from './interfaces';

@Module({
  providers: [
    { provide: Interface.IUserRepository, useClass: UserRepository },
    { provide: Interface.IUserService, useClass: UserService },
    UserService
  ],
  imports: [DbModule.forFeatureTypeORM([User], 'auth')],
  exports: [Interface.IUserService],
  controllers: [UserController]
})
export class UserModule { }
