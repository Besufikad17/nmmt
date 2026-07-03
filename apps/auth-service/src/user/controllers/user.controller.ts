import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, FindUserDto, UpdateUserDto } from '@app/common/dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'findUser' })
  async findUser(findUserDto: FindUserDto) {
    return await this.userService.findUser(findUserDto);
  }

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser(updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(updateUserDto);
  }
}
