import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerPath = 'api';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Posteve Swagger docs')
  .setDescription('this is the documentation for posteve api')
  .setVersion('1.0')
  .addTag('posteve')
  .build();
