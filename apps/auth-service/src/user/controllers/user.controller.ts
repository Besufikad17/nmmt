import { Controller } from '@nestjs/common';
import { IUserService } from '../interfaces';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: IUserService) { }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
