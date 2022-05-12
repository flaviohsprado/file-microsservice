import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptionalStringColumn } from './../../commons/decorators/column/isOptionalStringColumn.decorator';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsOptionalStringColumn()
  public originalname?: string;

  @IsOptionalStringColumn()
  public ownerId: string;

  @IsOptionalStringColumn()
  public ownerType: string;

  @IsOptionalStringColumn()
  public key: string;

  @IsOptionalStringColumn()
  public url: string;

  @Column({ type: 'bytea', nullable: true })
  public buffer?: Buffer;
}
