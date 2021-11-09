/* eslint-disable no-var */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import { CreateStudentInput } from './dto/create-student.input';
import CREATE_BULK_STUDENTS from './query/create-bulk-student-mutation';

@Injectable()
export class StudentFileUploadService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async bulkUpload(jobData: Express.Multer.File) {
    const chunks = [];
    const students: CreateStudentInput[] = [];
    fs.createReadStream(jobData.path)
      .on('error', (error) => {
        console.error(error);
        throw error.message;
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
              console.log('successfuly executed create bulk student');
            },
            (error) => {
              console.log('failed create bulk student execution', error);
              throw new Error('Error in student bulk creation');
            },
          );
        } catch (error) {
          throw new Error('Error occured!');
        }
      });
  }
}
