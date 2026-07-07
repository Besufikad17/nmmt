import { CreateRefreshTokenDto, DeleteRefreshTokensDto, FindRefreshTokenDto, FindRefreshTokensDto } from '@app/common/dto';
import { IRefreshTokenService } from '@app/common/interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private service: IRefreshTokenService) { }

  @MessagePattern({ cmd: 'createRefreshToken' })
  async createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.service.createRefreshToken(createRefreshTokenDto);
  }

  @MessagePattern({ cmd: 'findRefreshToken' })
  async findRefreshToken(findRefreshTokenDto: FindRefreshTokenDto) {
    return await this.service.findRefreshToken(findRefreshTokenDto);
  }

  @MessagePattern({ cmd: 'findRefreshTokens' })
  async findRefreshTokens(findRefreshTokensDto: FindRefreshTokensDto) {
    return await this.service.findRefreshTokens(findRefreshTokensDto);
  }

  @MessagePattern({ cmd: 'deleteRefreshTokens' })
  async deleteRefreshTokens(deleteRefreshTokensDto: DeleteRefreshTokensDto) {
    await this.service.deleteRefreshTokens(deleteRefreshTokensDto);
    return null;
  }
}
