import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../dto/auth.dto';
import { IAuthResponse, IAuthService } from '../interfaces';
import { IApiResponse } from '../../common/interfaces';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@app/common/interfaces';
import { JwtPayload } from '@app/common/interfaces';
import { compare } from '@app/common/utils/hash.utils';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { RefreshTokenService } from '../../refresh-token/services/refresh-token.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService
  ) { }

  private async generateAccessToken(user: IUser): Promise<string> {
    const secretKey = this.configService.get<string>("JWT_SECRET");
    if (!secretKey) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }

    const { id, phoneNumber, tokenVersion } = user;
    return this.jwtService.sign<JwtPayload>(
      {
        sub: id,
        phoneNumber,
        tokenVersion
      },
      {
        secret: secretKey,
        expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRES_IN") || "1hr",
      },
    );
  }

  private async generateRefreshToken(user: IUser, currentRefreshToken?: string, currentRefreshTokenExpiryDate?: Date) {
    const { id, phoneNumber, tokenVersion } = user;
    const newRefreshToken = this.jwtService.sign<JwtPayload>(
      { sub: id, phoneNumber, tokenVersion },
      {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRES_IN") || "30d"
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiryDate) {
      const tokenExists = await this.refreshTokenService.findRefreshToken({
        userId: id,
        refreshToken: newRefreshToken
      });

      if (tokenExists) {
        throw new BadRequestException("Invalid token!!");
      }

      await this.refreshTokenService.createRefreshToken({
        userId: id,
        refreshToken: currentRefreshToken,
        expiresAt: currentRefreshTokenExpiryDate
      });
    }

    return newRefreshToken;
  }

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

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

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
