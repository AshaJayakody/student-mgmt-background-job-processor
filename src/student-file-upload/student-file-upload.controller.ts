import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student-file')
export class StudentFileUploadController {
  constructor(
    @InjectQueue('student-file-queue') private readonly queue: Queue,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.queue.add(
      'upload',
      {
        file: file,
      },
      { delay: 5000 },
    );
    console.log('file:', file);
  }
}
