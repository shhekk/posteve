declare const module: any; // Add this for HMR **
import {
  InternalServerErrorException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions, swaggerPath } from './swagger';
import { CatchEverythingFilter } from '@posteve/nestjs-libraries/helper/ErrorHandling/global-errorHandling';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.enableCors({
    credentials: true,
    origin: corsOrigin,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    'context-check'
  );

  if (module.hot) {
    //**hmr */
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

function corsOrigin(origin: string, callback: any) {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'production') {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
      return;
    }
    console.log({ origin, allowedOrigin: process.env.FRONTEND_URL });
    callback(new Error('not allowed by CORS'));
    return;
  } else {
    callback(null, true); //return true for any origin in dev
    return;
  }

  // let allowedOrigin: string[] = [];
  // nodeEnv === 'production'
  //   ? (allowedOrigin = [process.env.FRONTEND_URL])
  //   : (allowedOrigin = [
  //       process.env.FRONTEND_URL,
  //       'http://localhost:4200',
  //       'http://[::1]:4200',
  //       'http://127.0.0.1:4200',
  //       'curl',
  //       '*',
  //     ]);
  //  // allow the undef origin as it is set by browser only
  // if (!origin || allowedOrigin.includes(origin)) {
  //   // console.log('cors success');
  //   callback(null, true);
  // } else {
  //   console.log({ origin, allowedOrigin });
  //   callback(new Error('not allowed by CORS'));
  // }
}

/**project idea (Nextjs)
 * An book reading website.(use your own authentication library for authentication or add multiple users feature)
 * a really nedded at least for my self
 * @features --
 * selected word translator ,
 * easy navigation between contens
 * better ui
 */
