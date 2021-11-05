/* eslint-disable prettier/prettier */
import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueError,
} from '@nestjs/bull';
import { Job } from 'bull';
import { StudentFileUploadService } from './student-file-upload.service';

@Processor('student-file-queue')
export class StudentFileProcessor {
  constructor(private studentFileUploadService: StudentFileUploadService) {}

  @Process('upload')
  async handleUpload(job: Job) {
    //this.logger.debug('Start uploading...');
    console.log('process:', job.data.file);
    await this.studentFileUploadService.bulkUpload(job.data.file);
  }

  @OnQueueActive({ name: 'upload' })
  onUploadActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError({ name: 'upload' })
  onUploadError(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted({ name: 'upload' })
  async onUploadComplete(job: Job, result: any) {
    //send notification
    console.log(
      `Processed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed({ name: 'upload' })
  onUploadFailed(job: Job) {
    //send notification
    console.log(
      `Processing failed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
