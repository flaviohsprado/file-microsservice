import {
  Controller,
  Param,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';
import { DeleteApiResponse } from './../commons/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from './../commons/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from './../commons/decorators/requests/postApiResponse.decorator';
import { UploadProducer } from './../jobs/upload.producer';
import { FileDto } from './dto/file.dto';
import { File } from './entities/file.entity';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('files')
export class FileController {
  constructor(
    private readonly service: FileService,
    private readonly uploadProducer: UploadProducer,
  ) {}

  @PostApiResponse(File, FileDto, '/queue')
  @UseInterceptors(FilesInterceptor('files'))
  public async upload(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    this.uploadProducer.upload(files);
  }

  @GetApiResponse(File, '/:ownerId/download')
  public async getFileDownload(
    @Res({ passthrough: true }) response: Response,
    @Param('ownerId') ownerId: string,
  ) {
    const file: File = await this.service.findByKey('ownerId', ownerId);

    const stream = Readable.from(file.buffer);

    response.set({
      'Content-Disposition': `attachment; filename="${file.originalname}"`,
      'Content-Type': 'application/json',
    });

    return new StreamableFile(stream);
  }

  @GetApiResponse(File, '/:ownerId/file')
  public async getFile(
    @Res() response: Response,
    @Param('ownerId') ownerId: string,
  ) {
    const file: File = await this.service.findByKey('ownerId', ownerId);

    const stream = Readable.from(file.buffer);

    stream.pipe(response);
  }

  @GetApiResponse(File, '/:ownerId/stream')
  public async getFileStream(
    @Res({ passthrough: true }) response: Response,
    @Param('ownerId') ownerId: string,
  ) {
    const file = await this.service.findByKey('ownerId', ownerId);
    const stream = Readable.from(file.buffer);

    response.set({
      'Content-Disposition': `inline; filename="${file.originalname}"`,
      'Content-Type': 'application/json',
    });

    return new StreamableFile(stream);
  }

  @PostApiResponse(File, FileDto)
  @UseInterceptors(FilesInterceptor('files'))
  public create(@UploadedFiles() files: FileDto[]): Promise<File[]> {
    files.forEach((file) => {
      new FileDto(file);
    });

    return this.service.create(files);
  }

  @DeleteApiResponse(':key')
  public delete(@Param('key') key: string): Promise<boolean> {
    return this.service.destroy(key);
  }
}
