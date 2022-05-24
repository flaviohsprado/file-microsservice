import { ApiProperty } from '@nestjs/swagger';
import { IsRequiredString } from './../../commons/decorators/validation/isRequiredString.decorator';
import { IsOptionalString } from './../../commons/decorators/validation/isOptionalString.decorator';
import { uuid } from 'uuidv4';

export class FileDto {
  @IsOptionalString()
  id?: string;

  @IsOptionalString()
  ownerId?: string;

  @IsOptionalString()
  ownerType?: string;

  @IsRequiredString()
  fieldname: string;

  @IsRequiredString()
  originalname: string;

  @IsRequiredString()
  encoding: string;

  @IsRequiredString()
  mimetype: string;

  @IsRequiredString()
  key?: string;

  @IsRequiredString()
  url?: string;

  @ApiProperty({ type: Buffer })
  buffer: Buffer;

  constructor(props: FileDto, id?: string) {
    Object.assign(this, props);

    this.id = id || uuid();
  }
}
