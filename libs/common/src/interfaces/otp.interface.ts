import { RequestOtpDto } from "../dto";
import { OtpChannel, OtpPurpose } from "../enums";
import { IApiResponse } from "./api.response.interface";

export interface IOtp {
	id: string;
	hash: string;
	userId?: string;
	used: boolean;
	target: string;
	channel: OtpChannel;
	purpose: OtpPurpose;
	attempts: number;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export abstract class IOtpService {
	abstract requestOtp(dto: RequestOtpDto, userId?: string): Promise<IApiResponse<null>>;
}
