/* eslint-disable no-var */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import { CreateStudentInput } from './dto/create-student.input';
import CREATE_BULK_STUDENTS from './query/create-bulk-student-mutation';

@Injectable()
export class StudentFileUploadService {
  constructor(private httpService: HttpService) {}

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
              const date = new Date();

              object[workbook[i].data[0][0]] = workbook[i].data[j][0];
              object[workbook[i].data[0][1]] = workbook[i].data[j][1];
              object[workbook[i].data[0][2]] = workbook[i].data[j][2];
              object[workbook[i].data[0][3]] = date.setDate(
                date.getDate() + workbook[i].data[j][3],
              ); //todo : fix parse xlsx error in date convertion

              const student = new CreateStudentInput();
              Object.assign(student, object);
              students.push(student);
            }
          }

          const request = {
            url: 'http://localhost:3000/graphql', //todo : put into config
            method: 'post',
            data: {
              query: CREATE_BULK_STUDENTS,
              variables: {
                createStudentInputBulk: students,
              },
            },
          };

          await this.httpService.post(request.url, request.data).subscribe(
            (result) => {
              console.log('successfuly executed create bulk student', result);
            },
            (error) => {
              console.log('failed create bulk student execution', error);
              throw new Error('Error in student bulk creation');
            },
          );
        } catch (error) {
          console.log(error.message);
          throw new Error('Error occured!');
        }
      });
  }
}
