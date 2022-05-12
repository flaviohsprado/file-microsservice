import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadRepository } from './../commons/repositories/upload.repository';
import { FileDto } from './dto/file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private repository: Repository<File>,
    @Inject('UPLOAD_REPOSITORY') private uploadRepository: UploadRepository,
  ) {}

  public async find(ownerId: string): Promise<File[]> {
    return this.repository.find({
      where: { ownerId },
    });
  }

  public async findByKey(key: string, value: string): Promise<File> {
    return this.repository.findOne({
      where: { [key]: value },
    });
  }

  public async create(
    files: FileDto[],
    ownerId?: string,
    ownerType?: string,
  ): Promise<File[]> {
    if (process.env.LOCAL_UPLOAD === 'true') {
      return this.save(files, ownerId, ownerType);
    } else {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          return this.uploadRepository.upload(file);
        }),
      );

      return this.save(uploadedFiles, ownerId, ownerType);
    }
  }

  public async update(
    files: FileDto[],
    ownerId: string,
    ownerType: string,
  ): Promise<File[]> {
    const file: File = await this.findByKey('ownerId', ownerId);

    if (file) await this.destroy(ownerId);

    return this.create(files, ownerId, ownerType);
  }

  private async save(
    files: FileDto[],
    ownerId: string,
    ownerType: string,
  ): Promise<File[]> {
    return Promise.all(
      files.map(async (file) => {
        const fileEntity = this.repository.create({
          ...file,
          ownerId,
          ownerType,
        });

        return this.repository.save(fileEntity);
      }),
    );
  }

  public async destroy(key: string): Promise<boolean> {
    if (process.env.LOCAL_UPLOAD === 'false')
      await this.uploadRepository.delete(key);

    this.repository.delete({ key });

    return true;
  }
}
