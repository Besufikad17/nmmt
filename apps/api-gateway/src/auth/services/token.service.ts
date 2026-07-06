import { BadRequestException, Injectable } from "@nestjs/common";
import { ITokenService } from "../interfaces/toke.service.interface";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenService } from "../../refresh-token/services/refresh-token.service";
import { IUser, JwtPayload } from "@app/common/interfaces";

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  async generateAccessToken(user: IUser): Promise<string> {
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

  async generateRefreshToken(user: IUser, currentRefreshToken?: string, currentRefreshTokenExpiryDate?: Date) {
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
}
