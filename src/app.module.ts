import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { connection } from './commons/config/connectionDatabase.config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      renderPath: '/documentation',
    }),
    TypeOrmModule.forRoot({
      ...connection,
    }),
    FileModule,
  ],
})
export class AppModule {}
