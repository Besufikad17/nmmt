import { GetOtpDto, RequestOtpDto, ResendOtpDto, VerifyOtpDto } from "../dto";
import { OtpChannel, OtpPurpose, OtpStatus } from "../enums";
import { IApiResponse } from "./api.response.interface";

export interface IOtp {
	id: string;
	hash: string;
	userId?: string;
	used: boolean;
	target: string;
	channel: OtpChannel;
	purpose: OtpPurpose;
	status: OtpStatus;
	attempts: number;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export abstract class IOtpService {
	abstract requestOtp(dto: RequestOtpDto, userId?: string): Promise<IApiResponse<null>>;
	abstract getOtp(dto: GetOtpDto): Promise<IOtp | null>;
	abstract resendOtp(resendOtpDto: ResendOtpDto, userId?: string): Promise<IApiResponse<null>>;
	abstract verifyOtp(verifyOtpDto: VerifyOtpDto, userId?: string): Promise<IApiResponse<null>>;
}
