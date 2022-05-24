/* istanbul ignore file */
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { UploadRepository } from '../commons/repositories/upload.repository';
import { UploadConsumer } from '../jobs/upload.consumer';
import { s3WorkerV2Library } from './../commons/libs/s3/workerV2.library';
import { UploadProducer } from './../jobs/upload.producer';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    BullModule.registerQueue({
      name: 'upload',
      limiter: {
        max: 100,
        duration: 10000,
      },
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'UPLOAD_REPOSITORY',
      useValue: new UploadRepository(new s3WorkerV2Library()),
    },
    UploadProducer,
    UploadConsumer,
  ],
  exports: [FileService],
})
export class FileModule {
  constructor(@InjectQueue('upload') private queue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.queue)]);

    consumer.apply(router).forRoutes('/admin/jobs');
  }
}
