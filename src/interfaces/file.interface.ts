import { Readable } from 'stream';

export interface IFile {
  Bucket: string;
  Key: string;
  Body: Buffer | Readable;
  ContentType: string;
  ACL: string;
  path?: string;
}
