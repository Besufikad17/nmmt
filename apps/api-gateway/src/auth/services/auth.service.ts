import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../dto/auth.dto';
import { IAuthResponse, IAuthService } from '../interfaces';
import { IApiResponse } from '../../common/interfaces';
import { compare } from '@app/common/utils/hash.utils';
import { UserService } from '../../user/services/user.service';
import { ITokenService } from '../interfaces/toke.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userService: UserService
  ) { }

  async login(loginDto: LoginDto): Promise<IApiResponse<IAuthResponse>> {
    try {
      const { phoneNumber, password } = loginDto;
      const user = await this.userService.findUser({ phoneNumber });
      if (!user) throw new BadRequestException('Invalid credentials!!');

      const { id, passwordHashed } = user;
      const passwordMatch: boolean = await compare(password, passwordHashed);
      if (!passwordMatch) throw new BadRequestException('Invalid credentials!!');

      await this.userService.updateUser({
        id,
        lastLogin: new Date()
      });

      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(user);

      return {
        message: "Login successful",
        data: {
          accessToken,
          refreshToken
        },
        success: true
      };
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

  async signUp(signUpDto: SignUpDto): Promise<IApiResponse<IAuthResponse>> {
    try {
      const { phoneNumber } = signUpDto;
      const user = await this.userService.findUser({ phoneNumber });
      if (user) {
        throw new NotFoundException("User already exists with this credentials");
      }

      await this.userService.createUser({ ...signUpDto });

      return {
        message: "User signed up",
        success: true
      };
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
