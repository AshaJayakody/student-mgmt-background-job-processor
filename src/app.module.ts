import { Module } from '@nestjs/common';
import { StudentFileUploadModule } from './student-file-upload/student-file-upload.module';
import { BullModule } from '@nestjs/bull';
import { NotificationGateway } from './notification.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StudentFileUploadModule,
  ],
  controllers: [],
  providers: [NotificationGateway],
})
export class AppModule {}
