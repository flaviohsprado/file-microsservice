import { FileDto } from './../file/dto/file.dto';
export interface IUploadFile {
  files: Express.Multer.File[];
  filesUploaded?: FileDto[];
  ownerId?: string;
  ownerType?: string;
}
