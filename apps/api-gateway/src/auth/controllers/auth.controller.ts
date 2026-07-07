import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { IAuthService } from '../interfaces';
import { AuthResponse, LoginDto, SignUpDto } from '../dto/auth.dto';
import { ApiOkResponseWithData } from '@app/config';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';
import type { IUser } from '@app/common/interfaces';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { JwtGuard } from '../../common/guards/jwt.guard';

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

  @Post("login")
  @ApiOkResponseWithData(AuthResponse)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto
  ) {
    return await this.service.login(dto);
  }

  @Post("token/refresh")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWithData(AuthResponse)
  async refreshTokens(
    @Headers("authorization") auth: string,
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.refreshToken({
      userId: user.id, email: user.phoneNumber!, currentRefreshToken: auth.split(" ")[1]
    });
  }

  @Post("signout")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWithData(EmptyBodyResponse)
  async signOut(
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.signOut(user.id);
  }
}
