import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './routes/auth.controller';
import { PermissionGuard } from '@posteve/nestjs-libraries/auth/permission/permission.guard';
import { AuthMiddleware } from '@posteve/nestjs-libraries/auth/auth.middleware';
import { protectedController } from './routes/protected.controller';
import { PostController } from './routes/post.controller';
import { StorageModule } from '@posteve/nestjs-libraries/storage/upload.module';
import { MediaController } from './routes/media.controller';
import { PlatformController } from './routes/platform.controller';
import { PlatformManager } from '@posteve/nestjs-libraries/social-media/platform.manager';
import { UserController } from './routes/user.controller';

const authenticatedController = [
  protectedController,
  PostController,
  MediaController,
  PlatformController,
  UserController,
];

@Module({
  imports: [StorageModule],
  controllers: [AuthController, ...authenticatedController],
  providers: [PermissionGuard, StorageModule, PlatformManager],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...authenticatedController);
  }
}

//here all the modules and services are
