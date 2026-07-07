import { IApiResponse } from "@app/common/interfaces";
import { LoginDto, RefreshTokenDto, SignUpDto } from "../dto/auth.dto";

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class IAuthService {
  abstract login(loginDto: LoginDto): Promise<IApiResponse<IAuthResponse>>;
  abstract signUp(signUpDto: SignUpDto): Promise<IApiResponse<IAuthResponse>>;
  abstract refreshToken(refreshTokenDto: RefreshTokenDto): Promise<IApiResponse<IAuthResponse>>;
}
