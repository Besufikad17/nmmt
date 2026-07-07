import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt } from "passport-jwt";
import { JwtPayload } from "@app/common/interfaces";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET")!,
    });
  }

  async validate(payload: JwtPayload) {
    const authUser = await this.userService.findUser({ id: payload.sub });
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return {
      user: authUser,
      refreshTokenExpiresAt: new Date(payload.exp as number * 1000),
    };
  }
}
