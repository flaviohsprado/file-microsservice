import { IFile } from './file.interface';

export interface IWorkingLibrary {
  download(key: string): Promise<IFile[]>;
  upload(params: IFile): Promise<any>;
  delete(key: string): Promise<boolean>;
}
