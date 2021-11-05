import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(80)
export class NotificationGateway {
  @SubscribeMessage('file-upload')
  handleEvent(@MessageBody() message: string): string {
    return message;
  }
}
