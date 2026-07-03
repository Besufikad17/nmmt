import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, FindUserDto, UpdateUserDto } from '@app/common/dto';
import { IUser, IUserService } from '@app/common/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) { }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      return firstValueFrom(
        this.client.send<IUser>(
          { cmd: 'createUser' },
          { ...createUserDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async findUser(findUserDto: FindUserDto): Promise<IUser | null> {
    try {
      return firstValueFrom(
        this.client.send<IUser | null>(
          { cmd: 'findUser' },
          { ...findUserDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    try {
      firstValueFrom(
        this.client.send(
          { cmd: 'updateUser' },
          { ...updateUserDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
