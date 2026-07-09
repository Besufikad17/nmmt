import { HttpStatus, Injectable } from '@nestjs/common';
import { ISMService, ISMSResponse } from '../interfaces';
import { SendMessageDto } from '../dto/sms.dto';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService implements ISMService {
  constructor(private config: ConfigService) { }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ISMSResponse> {
    try {
      const { message, to } = sendMessageDto;

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.config.get<string>('AFRO_MESSAGE_TOKEN')}`);
      myHeaders.append("Content-Type", "application/json");

      const smsMessage = {
        from: this.config.get<string>('AFRO_MESSAGE_IDENTIFIER'),
        sender: this.config.get<string>('AFRO_MESSAGE_SENDER'),
        to,
        message
      };

      fetch(`${this.config.get<string>('AFRO_MESSAGE_BASE_URL')}/send`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(smsMessage)
      })
        .then((response) => response.text())
        .then((result) => {
          return;
        })
        .catch((error) => console.error(error));

      return {
        message: "Message sent"
      };
    } catch (error) {
      console.log(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.meta || 'Error occurred check the log in the server',
          meta: error.meta || {},
        });
      }
    }
  }
}
