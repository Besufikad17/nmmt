import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Interface from './interfaces';

@Module({
  providers: [
    { provide: Interface.IMailService, useClass: MailService },
    MailService
  ],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: "gmail",
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>("MAIL_USER"),
            pass: config.get<string>("MAIL_PASS"),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>("MAIL_FROM") || config.get<string>("MAIL_USER")}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [Interface.IMailService]
})
export class MailModule { }
