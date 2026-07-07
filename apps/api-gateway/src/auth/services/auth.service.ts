import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, RefreshTokenDto, SignUpDto } from '../dto/auth.dto';
import { IAuthResponse, IAuthService } from '../interfaces';
import { compare } from '@app/common/utils/hash.utils';
import { UserService } from '../../user/services/user.service';
import { ITokenService } from '../interfaces/toke.service.interface';
import { decodeToken } from '@app/common/utils/jwt.utils';
import { IApiResponse } from '@app/common/interfaces';
import { RefreshTokenService } from '../../refresh-token/services/refresh-token.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
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

  async signUp(signUpDto: SignUpDto): Promise<IApiResponse<null>> {
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

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<IApiResponse<IAuthResponse>> {
    try {
      const { userId, currentRefreshToken } = refreshTokenDto;

      const user = await this.userService.findUser({
        id: userId
      });

      if (!user) throw new NotFoundException('User not found!!');

      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(
        user, currentRefreshToken,
        currentRefreshToken ?
          new Date(decodeToken(currentRefreshToken).exp as number) : undefined);

      return {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken,
          refreshToken
        }
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

  async signOut(userId: string): Promise<IApiResponse<null>> {
    try {
      const user = await this.userService.findUser({
        id: userId
      });

      if (!user) throw new NotFoundException('User not found!!');

      await this.refreshTokenService.deleteRefreshTokens({ userId });
      await this.userService.updateUser({
        id: userId,
        tokenVersion: user.tokenVersion + 1
      });

      return {
        message: 'User signed out',
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
