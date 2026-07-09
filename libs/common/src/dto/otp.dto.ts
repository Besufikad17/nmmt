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
