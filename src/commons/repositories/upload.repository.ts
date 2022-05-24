import { IFile } from '../../interfaces/file.interface';
import { FileDto } from '../../file/dto/file.dto';
import { IWorkingLibrary } from '../../interfaces/working.interface';
import { Inject, Injectable } from '@nestjs/common';
import StandardError from '../../utils/error.utils';
import { config } from '../constants/aws.constant';

@Injectable()
export class UploadRepository {
  constructor(
    @Inject('UPLOAD_WORKING_LIBRARY') private uploadService: IWorkingLibrary,
  ) {}

  public async upload(file: FileDto): Promise<FileDto> {
    const uploadFile: IFile = this.generateFile(file);

    const uploadedFileUrl = await this.uploadService.upload(uploadFile);

    if (!uploadedFileUrl)
      throw new StandardError(400, 'Not have file ou files for uploaded!');

    file.url = uploadedFileUrl;
    file.key = uploadFile.Key;
    delete file.buffer;

    return file;
  }

  public async delete(key: string): Promise<boolean> {
    return await this.uploadService.delete(key);
  }

  private generateFile(file: FileDto): IFile {
    return <IFile>{
      Bucket: config.bucketName,
      Key: this.generateFileKey(file.originalname),
      ContentType: file.mimetype,
      Body: Buffer.from(file.buffer),
      ACL: config.defaultFilesACL,
    };
  }

  private generateFileKey(originalName: string): string {
    const fileName = originalName?.split('.')?.shift() ?? originalName;
    return `${fileName}_${Date.now()}`;
  }
}
