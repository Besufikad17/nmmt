import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Otp } from "../entities/otp.entity";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity, Repository } from "typeorm";
import { IOtpRepository } from "../interfaces/otp.repository.interface";

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @InjectRepository(Otp, 'auth') private readonly otpRepository: Repository<Otp>
  ) { }

  async createOtp(createOtpArgs: DeepPartial<Otp>): Promise<Otp> {
    const otp = this.otpRepository.create(createOtpArgs);
    const savedOtp = await this.otpRepository.save(otp);
    return (Array.isArray(savedOtp) ? savedOtp[0] : savedOtp) as Otp;
  }

  async findOtps(findOtpsArgs: FindManyOptions<Otp>): Promise<Otp[]> {
    return this.otpRepository.find(findOtpsArgs);
  }

  async findOtp(findOtpArgs: FindOneOptions<Otp>): Promise<Otp | null> {
    return this.otpRepository.findOne(findOtpArgs);
  }

  async updateOtp(updateYserArgs: { where: FindOptionsWhere<Otp>; data: QueryDeepPartialEntity<Otp>; }): Promise<void> {
    this.otpRepository.update(updateYserArgs.where, updateYserArgs.data);
  }

  async deleteOtp(id: string): Promise<void> {
    this.otpRepository.delete(id);
  }
}
