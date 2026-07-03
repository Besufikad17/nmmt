import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsValidPhoneNumber, TransformPhoneNumber } from "../validators/phone.validator";

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @TransformPhoneNumber()
  @IsValidPhoneNumber()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginDto extends SignUpDto { }

