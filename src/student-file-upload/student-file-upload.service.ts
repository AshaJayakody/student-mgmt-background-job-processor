/* eslint-disable no-var */
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import { NotificationGateway } from 'src/notification.gateway';
import { CreateStudentInput } from './dto/create-student.input';
import CREATE_BULK_STUDENTS from './query/create-bulk-student-mutation';

@Injectable()
export class StudentFileUploadService {
  private readonly logger = new Logger(StudentFileUploadService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private notification: NotificationGateway,
  ) {}

  async bulkUpload(jobData: Express.Multer.File) {
    const chunks = [];
    const students: CreateStudentInput[] = [];
    fs.createReadStream(jobData.path)
      .on('error', (error) => {
        this.logger.debug(
          new Date().toUTCString() + ' - Error in reading file - ' + error,
        );
        this.notification.sendMessage('Error in reading file!');
      })
      .on('data', (row) => {
        chunks.push(row);
      })
      .on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const workbook = xlsx.parse(buffer);

          for (let i = 0; i < workbook.length; i++) {
            for (let j = 1; j < workbook[i].data.length; j++) {
              const object = {};

              object[workbook[i].data[0][0]] = workbook[i].data[j][0];
              object[workbook[i].data[0][1]] = workbook[i].data[j][1];
              object[workbook[i].data[0][2]] = workbook[i].data[j][2];
              object[workbook[i].data[0][3]] = new Date(
                (workbook[i].data[j][3] - 25567 - 2) * 86400 * 1000,
              );

              const student = new CreateStudentInput();
              Object.assign(student, object);
              students.push(student);
            }
          }

          const request = {
            url: this.configService.get<string>('GRAPHQL_SERVER_URL'),
            method: 'post',
            data: {
              query: CREATE_BULK_STUDENTS,
              variables: {
                createStudentInputBulk: students,
              },
            },
          };

          await this.httpService.post(request.url, request.data).subscribe(
            () => {
              this.logger.debug(
                new Date().toUTCString() + ' - Students upload completed - ',
              );
              this.notification.sendMessage('Students upload completed!');
            },
            (error) => {
              this.logger.debug(
                new Date().toUTCString() +
                  ' - Error in saving students to database - ' +
                  error,
              );
              this.notification.sendMessage(
                'Error in saving students to database!',
              );
            },
          );
        } catch (error) {
          this.logger.debug(
            new Date().toUTCString() +
              ' - Error in processing file -  ' +
              error,
          );
          this.notification.sendMessage('Error in processing file!');
        }
      });
  }
}
