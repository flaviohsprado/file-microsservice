import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { join } from 'path';
import { connection } from './commons/config/connectionDatabase.config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6380,
        showFriendlyErrorStack: true,
      },
    }),
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
