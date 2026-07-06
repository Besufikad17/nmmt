import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IAuthService } from '../interfaces';
import { SignUpDto } from '../dto/auth.dto';
import { ApiOkResponseWithData } from '@app/config';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private service: IAuthService
  ) { }

  @Post("/signup")
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: SignUpDto
  ) {
    return await this.service.signUp(dto);
  }
}
