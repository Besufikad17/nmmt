import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { OtpChannel, OtpPurpose } from "../enums";
import { ApiProperty } from "@nestjs/swagger";

export class RequestOtpDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly target: string;

	@ApiProperty({ enum: OtpChannel })
	@IsNotEmpty()
	@IsEnum(OtpChannel)
	readonly channel: OtpChannel;

	@ApiProperty({ enum: OtpPurpose })
	@IsNotEmpty()
	@IsEnum(OtpPurpose)
	readonly purpose: OtpPurpose;
}

export class GetOtpDto extends RequestOtpDto { }

export class ResendOtpDto extends RequestOtpDto { }

export class VerifyOtpDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly target: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly otpCode: string;

	@ApiProperty({ enum: OtpPurpose })
	@IsEnum(OtpPurpose)
	@IsNotEmpty()
	readonly purpose: OtpPurpose;
}
