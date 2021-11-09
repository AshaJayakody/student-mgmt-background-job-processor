/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8080, { cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  sendMessage(@MessageBody() message: any): void {
    this.server.emit('message', message);
  }
}
