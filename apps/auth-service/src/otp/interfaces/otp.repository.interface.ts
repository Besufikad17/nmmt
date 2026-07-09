import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";
import { Otp } from "../entities/otp.entity";

export abstract class IOtpRepository {
  abstract createOtp(createOtpArgs: DeepPartial<Otp>): Promise<Otp>;
  abstract findOtps(findOtpsArgs: FindManyOptions<Otp>): Promise<Otp[]>;
  abstract findOtp(findOtpArgs: FindOneOptions<Otp>): Promise<Otp | null>;
  abstract updateOtp(updateYserArgs: { where: FindOptionsWhere<Otp>; data: QueryDeepPartialEntity<Otp>; }): Promise<void>;
  abstract deleteOtp(id: string): Promise<void>;
}
