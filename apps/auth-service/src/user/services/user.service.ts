import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository, IUserService } from '../interfaces';
import { User } from '../entities/user.entity';
import { LoggerService } from 'lib/common';
import { CreateUserDto } from '../dto/user.dto';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'lib/common/utils/hash.utils';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: IUserRepository
  ) {
    this.logger.setContext(UserService.name);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userWithoutPassword } = createUserDto;
      const hashedPassword = await hash(password, 10);

      return await this.userRepository.createUser({
        ...userWithoutPassword,
        passwordHashed: hashedPassword
      });
    } catch (error) {
      this.logger.error(error.message || 'Failed to create user!!');
      throw new RpcException({
        message: 'Failed to create user!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }
}
