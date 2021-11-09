import { Module } from '@nestjs/common';
import { StudentFileUploadController } from './student-file-upload.controller';
import { StudentFileUploadService } from './student-file-upload.service';
import { BullModule } from '@nestjs/bull';
import { StudentFileProcessor } from './student-file-upload-processor';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { NotificationGateway } from 'src/notification.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'student-file-queue',
    }),
    MulterModule.register({
      dest: './upload',
    }),
    HttpModule,
  ],
  controllers: [StudentFileUploadController],
  providers: [
    StudentFileUploadService,
    StudentFileProcessor,
    NotificationGateway,
  ],
})
export class StudentFileUploadModule {}
