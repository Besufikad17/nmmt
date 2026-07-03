import { IApiResponse } from "../../common/interfaces";
import { LoginDto, SignUpDto } from "../dto/auth.dto";

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class IAuthService {
  abstract login(loginDto: LoginDto): Promise<IApiResponse<IAuthResponse>>;

  abstract signUp(signUpDto: SignUpDto): Promise<IApiResponse<IAuthResponse>>;
}
