import { Injectable, Logger } from '@nestjs/common';
import StandardError from '../../../utils/error.utils';
import { IFile } from './../../../interfaces/file.interface';
import { IWorkingLibrary } from './../../../interfaces/working.interface';
import { config } from './../../constants/aws.constant';
import { s3ClientV2 } from './clientV2.service';

@Injectable()
export class s3WorkerV2Library implements IWorkingLibrary {
  private readonly bucketName = config.bucketName;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('s3WorkerLibrary');
  }

  public async download(): Promise<any> {
    s3ClientV2.listObjects({ Bucket: this.bucketName }, function (err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data);
      }
    });
  }

  public async upload(params: IFile): Promise<any> {
    return s3ClientV2
      .upload(params)
      .promise()
      .then((data) => {
        this.logger.log(`File ${params.Key} uploaded!`);
        return String(data.Location);
      })
      .catch((err) => {
        this.logger.error(err);
        throw new StandardError(503, 'Error uploading file!');
      });
  }

  public async delete(key: string): Promise<boolean> {
    return s3ClientV2
      .deleteObject({ Bucket: this.bucketName, Key: key })
      .promise()
      .then((data) => {
        this.logger.log(`File ${key} deleted!`);
        return data.DeleteMarker;
      })
      .catch((err) => {
        this.logger.error(err);
        throw new StandardError(503, 'Error deleting file!');
      });
  }
}
