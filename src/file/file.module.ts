/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadRepository } from '../commons/repositories/upload.repository';
import { s3WorkerV2Library } from './../commons/libs/s3/workerV2.library';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'UPLOAD_REPOSITORY',
      useValue: new UploadRepository(new s3WorkerV2Library()),
    },
  ],
  exports: [FileService],
})
export class FileModule {}
