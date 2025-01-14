import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { EmailService } from '@posteve/nestjs-libraries/email/email.service';
import { PostService } from './post/post.service';
import { PostRepository } from './post/post.repository';
import { PlatformRepository } from './platform/platform.repository';
import { PlatformService } from './platform/platform.service';

@Global()
@Module({
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    EmailService,
    PostService,
    PostRepository,
    PlatformService,
    PlatformRepository,
  ],
  // exports: [UserService, UserRepository],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
