import {
  OnQueueCompleted,
  OnQueueError,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import StandardError from 'src/utils/error.utils';
import { Repository } from 'typeorm';
import { UploadRepository } from '../commons/repositories/upload.repository';
import { FileDto } from './../file/dto/file.dto';
import { File } from './../file/entities/file.entity';
import { IUploadFile } from './../interfaces/uploadFile.interface';

@Processor('upload') //the same name of the queue injectable in producer
export class UploadConsumer {
  private logger: Logger;

  constructor(
    @InjectRepository(File) private repository: Repository<File>,
    @Inject('UPLOAD_REPOSITORY') private uploadRepository: UploadRepository,
  ) {
    this.logger = new Logger('UploadConsumer');
  }

  @Process('optimize')
  public async optimize(job: Job<IUploadFile>): Promise<void> {
    //TODO: optimize the files
    /*const filesOptimizated: Express.Multer.File[] =
      await OptimizeUtils.optimize(job.data.files);*/

    //job.data.files = filesOptimizated;

    this.logger.log(`job optimize with data ${job.data}`);

    job.progress(30);

    job.queue.add('upload', job.data);
  }

  @Process('upload')
  public async upload(job: Job<IUploadFile>): Promise<void> {
    this.logger.log(`job upload with data ${job.data}`);

    job.data.filesUploaded = new Array<FileDto>();

    for (const file of job.data.files) {
      const uploadFile: FileDto = new FileDto(file);

      const fileUploaded = await this.uploadRepository.upload(uploadFile);

      job.data.filesUploaded.push(fileUploaded);
    }

    job.progress(70);

    job.queue.add('save', job.data);
  }

  @Process('save')
  public async save(job: Job<IUploadFile>): Promise<void> {
    this.logger.log(`job save with data ${job.data}`);

    for (const file of job.data.filesUploaded) {
      const fileEntity = this.repository.create({
        ...file,
        ownerId: job.data.ownerId,
        ownerType: job.data.ownerType,
      });

      await this.repository.save(fileEntity);
    }

    job.progress(100);
  }

  @OnQueueProgress()
  public async onProgress(job: Job): Promise<void> {
    this.logger.log(`job progress: ${job.progress()}%`);
  }

  @OnQueueCompleted()
  public async onCompleted(job: Job): Promise<void> {
    this.logger.log(`job completed. Progress: ${job.progress()}%`);
  }

  @OnQueueError()
  public async onError(error: Error): Promise<void> {
    throw new StandardError(507, error.message);
  }
}
