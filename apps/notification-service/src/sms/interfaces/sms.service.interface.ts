import { SendMessageDto } from "../dto/sms.dto";

export interface ISMSResponse {
  message: string;
}

export abstract class ISMService {
  abstract sendMessage(sendMessageDto: SendMessageDto): Promise<ISMSResponse>;
}
