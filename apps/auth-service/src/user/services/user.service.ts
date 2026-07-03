import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces';
import { User } from '../entities/user.entity';
import { LoggerService } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { hash } from '@app/common/utils/hash.utils';
import { IUserService } from '@app/common/interfaces';
import { CreateUserDto, FindUserDto, UpdateUserDto } from '@app/common/dto';

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

  async findUser(findUserDto: FindUserDto): Promise<User | null> {
    try {
      return await this.userRepository.findUser({
        where: { ...findUserDto }
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    try {
      const { id, ...updatePayload } = updateUserDto;

      return await this.userRepository.updateUser({
        where: { id },
        data: { ...updatePayload }
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
