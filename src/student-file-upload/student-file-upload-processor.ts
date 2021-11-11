/* eslint-disable prettier/prettier */
import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueError,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { NotificationGateway } from 'src/notification.gateway';
import { StudentFileUploadService } from './student-file-upload.service';

@Processor('student-file-queue')
export class StudentFileProcessor {
  private readonly logger = new Logger(StudentFileProcessor.name);
  constructor(private studentFileUploadService: StudentFileUploadService, private notification : NotificationGateway) {}

  @Process('upload')
  async handleUpload(job: Job) {
    this.logger.debug('Start uploading...');
    console.log('process:', job.data.file);
    await this.studentFileUploadService.bulkUpload(job.data.file);
  }

  @OnQueueActive({ name: 'upload' })
  onUploadActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError({ name: 'upload' })
  onUploadError(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
    this.notification.sendMessage('Upload Error!');
  }

  @OnQueueCompleted({ name: 'upload' })
  async onUploadComplete(job: Job, result: any) {
      this.logger.debug(
        `Processed job ${job.id} of type ${job.name} with data ${job.data}...`,
      );
  }

  @OnQueueFailed({ name: 'upload' })
  onUploadFailed(job: Job) {
    if(job.isFailed){
      this.logger.debug(
        `Processing failed job ${job.id} of type ${job.name} with data ${job.data}...`,
      );
      this.notification.sendMessage('Upload Failed!');
    }
  }
}
