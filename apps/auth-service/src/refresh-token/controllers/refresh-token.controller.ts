import { CreateRefreshTokenDto, FindRefreshTokenDto } from '@app/common/dto';
import { IRefreshTokenService } from '@app/common/interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private userService: IRefreshTokenService) { }

  @MessagePattern({ cmd: 'createRefreshToken' })
  async createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.userService.createRefreshToken(createRefreshTokenDto);
  }

  @MessagePattern({ cmd: 'findRefreshToken' })
  async findRefreshToken(findRefreshTokenDto: FindRefreshTokenDto) {
    return await this.userService.findRefreshToken(findRefreshTokenDto);
  }
}
