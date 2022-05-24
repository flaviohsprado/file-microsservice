import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UploadProducer {
  constructor(@InjectQueue('upload') private queue: Queue) {}

  public async upload(
    files: Express.Multer.File[],
    ownerId?: string,
    ownerType?: string,
  ): Promise<void> {
    await this.queue.add('optimize', {
      files,
      ownerId,
      ownerType,
    });
  }
}
