import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { IFile } from '../../../interfaces/file.interface';
import { IWorkingLibrary } from '../../../interfaces/working.interface';
import StandardError from '../../../utils/error.utils';
import { config } from '../../constants/aws.constant';
import { s3ClientV3 } from './clientV3.service';

@Injectable()
export class s3WorkerV3Library implements IWorkingLibrary {
  private readonly bucketName = config.bucketName;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('s3WorkerLibrary');
  }

  public async download(key: string): Promise<IFile[]> {
    //const command = new GetObjectCommand(key);

    return [
      {
        Key: key,
        Body: '' as any,
        ACL: 'public-read',
        Bucket: this.bucketName,
        ContentType: 'image/png',
      },
    ];
  }

  public async upload(params: IFile): Promise<any> {
    const command = new PutObjectCommand(params);

    await getSignedUrl(s3ClientV3, command, {
      expiresIn: 10000,
    })
      .then((url) => {
        this.logger.log(`File ${params.Key} uploaded!`);
        return String(url);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new StandardError(503, 'Error uploading file!');
      });

    /*s3Client
      .send(new PutObjectCommand(params))
      .then((data) => {
        this.logger.log(`File ${params.Key} uploaded!`);
        console.log('file', data);
        return data;
      })
      .catch((err) => {
        this.logger.error(err);
        throw new StandardError(503, 'Error uploading file!');
      });*/
  }

  public async delete(key: string): Promise<boolean> {
    return await s3ClientV3
      .send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )
      .then(() => {
        this.logger.log(`File ${key} deleted!`);
        return true;
      })
      .catch((error) => {
        this.logger.error(error);
        throw new StandardError(503, 'Error deleting file!');
      });
  }
}
