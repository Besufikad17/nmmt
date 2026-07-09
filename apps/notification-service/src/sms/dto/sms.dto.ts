import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly to: string;

  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
