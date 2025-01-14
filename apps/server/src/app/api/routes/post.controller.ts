//this controller will do crud on posts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CustomFileFieldsInterceptor } from '@posteve/nestjs-libraries/storage/fileValidation';
import { PostService } from '@posteve/nestjs-libraries/database/prisma/post/post.service';
import { CreatePostDTO } from '@posteve/nestjs-libraries/dtos/post.dto';
import { GetUser } from '@posteve/nestjs-libraries/user/user.from.request';
import { User } from '@prisma/client';
import { PlatformService } from '@posteve/nestjs-libraries/database/prisma/platform/platform.service';
import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
import {
  PlatformManager,
  validatePlatformPipe,
} from '@posteve/nestjs-libraries/social-media/platform.manager';

@Controller('post')
export class PostController {
  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _platformService: PlatformService,
    private _platform: PlatformManager
  ) {}

  @Get('hello/:identifier')
  hello(@Param('identifier', validatePlatformPipe) id: string) {

    console.log('controll hello/linkedin')
    return { data: 'aslkdjf', id };
  }

  // @UseInterceptors(CustomFileFieldsInterceptor)
  @Post('create/:identifier')
  async createPost(
    @GetUser() user: User,
    // @Body() dto: CreatePostDTO,
    @Param('identifier', validatePlatformPipe) identifier: string
  ) {
    try {
      // const { text, media } = dto;

      const { platform } = await this._userService.getUserPlatfroms({
        userId: user.id,
      });

      if (platform.length === 0) {
        console.log(platform);
        return {msg: false};
      }

      // const {} = this._platform.getPlatformInstance('');

      return platform;
      // const createPost = await this._postService.createPost({
      //   dto,
      //   userId: user.id,
      //   platformId:'',
      // });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
