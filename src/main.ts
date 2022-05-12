import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filters/httpException.filter';
import { TransformInterceptor } from './commons/interceptors/transform.interceptor';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });

  //await app.register(FastifyFormBody as any);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 200,
  });

  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription(
      'This is a sample Restaurant API with following modules: User, Auth, Product, Customer, Table, Order, OrderItem, NFCe, Company, Role, Cost and Report',
    )
    .setVersion('1.0')
    .addTag('File')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.listen(port);
}
bootstrap();
