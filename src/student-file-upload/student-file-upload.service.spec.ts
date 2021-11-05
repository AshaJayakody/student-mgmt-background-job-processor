import { Test, TestingModule } from '@nestjs/testing';
import { StudentFileUploadService } from './student-file-upload.service';

describe('StudentFileUploadService', () => {
  let service: StudentFileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentFileUploadService],
    }).compile();

    service = module.get<StudentFileUploadService>(StudentFileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
