import { Module } from '@nestjs/common';
import { StudentFileUploadModule } from './student-file-upload/student-file-upload.module';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1qazxsw2',
      database: 'Students',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    StudentFileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
