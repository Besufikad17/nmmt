import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { OtpController } from './controllers/otp.controller';
import * as Interfaces from './interfaces';
import { OtpRepository } from './repositories/otp.repository';
import { Otp } from './entities/otp.entity';
import { DbModule } from '@app/db';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    { provide: Interfaces.IOtpRepository, useClass: OtpRepository },
    OtpService,
  ],
  controllers: [OtpController],
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'NOTIFICATION_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('NOTIFICATION_SERVICE_URL'),
            port: configService.get<number>('NOTIFICATION_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DbModule.forFeatureTypeORM([Otp], 'auth'),
  ],
})
export class OtpModule { }
