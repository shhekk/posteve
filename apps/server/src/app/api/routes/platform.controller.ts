import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDTO } from '@posteve/nestjs-libraries/dtos/post.dto';
import { PlatformService } from '@posteve/nestjs-libraries/database/prisma/platform/platform.service';
import { GetUser } from '@posteve/nestjs-libraries/user/user.from.request';
import { User } from '@prisma/client';
import { log } from 'console';
import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
import {
  PlatformManager,
  validatePlatformPipe,
} from '@posteve/nestjs-libraries/social-media/platform.manager';

@Controller('platform')
export class PlatformController {
  constructor(
    private _platformService: PlatformService,
    private _platform: PlatformManager,
    private _userService: UserService
  ) {}

  //returns all the platform List this app supports
  @Get('/')
  async getPlatformList() {
    try {
      return this._platform.getPlatformList();
    } catch (error) {
      return false;
      // throw new InternalServerErrorException(
      //   error?.message || 'Something went wrong'
      // );
    }
  }

  @Get('connect/:identifier')
  async getAuthUrl(
    @Param('identifier', validatePlatformPipe) identifier: string
  ) {
    try {
      const { url, token } = await this._platform
        .getPlatformInstance(identifier)
        .getAuthUrl();

      return { url, ...(token ? { token } : {}) };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //give frontend as redirect_uri and that route should send code here
  @Post('connect/:identifier')
  async connect(
    @Param('identifier', validatePlatformPipe) identifier: string,
    @Query() q: any,
    @GetUser() user: User,
    @Body() body: { code: string; token: string }
  ) {
    //@todo implement pkce and add codeVerifier
    try {
      const { code, token: requestToken } = body;
      console.log('code is ::::::::::::::::::::::', code);
      if (!code) throw new NotFoundException({ err: 'code not found' });

      const userPlatformInstance = (
        await this._userService.getUserPlatfroms({
          userId: user.id,
        })
      ).platform.find((p) => p.identifier === identifier);
      if (userPlatformInstance) {
        throw new BadRequestException({
          //@todo need a better error handling
          err: 'social media already connected',
        });
      }

      const PlatformInstance = this._platform.getPlatformInstance(identifier);

      const {
        accessToken: token,
        expiresIn,
        id,
        refreshToken,
      } = await PlatformInstance.authenticate(code, requestToken);

      const dbres = await this._platformService.createPlatform({
        userId: user.id,
        expiresIn, //this should be date.now() + expiresIn
        identifier,
        urn: id,
        token,
        ...(refreshToken ? { refreshToken } : {}),
      });
      console.log({ dbres });

      return { data: token, dbres };
    } catch (error) {
      log(error);
      if (error.errorCode === 'P2002') {
        //@todo catch PrismaError in catcheverythingFilter
        throw new BadRequestException({ err: true, error });
      }
      return { err: true, error };
    }
  }

  @Post('post/:identifier')
  async post(
    @Body() Post: any,
    @GetUser() user: User,
    @Param('identifier', validatePlatformPipe) identifier: string
  ) {
    /**
     * todossss
     * create a post service which creates a post in db
     * use cloudinary there to upload post and store url
     *
     * here or in post controller you just create a post and shedule it
     * start with jst create and making a post to provider
     *
     */
    try {
      const { token, expiresIn, urn } =
        await this._platformService.getTokenBody(user.id, identifier);

      if (!token || parseInt(expiresIn) <= 0) {
        //@todo use microservice (bullmq) to emit 'renewAccessToken'
        throw new ForbiddenException({
          msg: `${identifier} not connected or token expired`,
        });
      }

      const PlatformInstance = this._platform.getPlatformInstance(identifier);

      const postedData = await PlatformInstance.post(token, Post, urn);

      return postedData;
    } catch (error) {
      //check cond. and if req. renewToken and re-emit the 'post' microservice
      log(error);
      throw new InternalServerErrorException({ error, err: true });
    }
  }
}
