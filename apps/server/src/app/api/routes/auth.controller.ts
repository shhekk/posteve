import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus, // use this for great recomendation
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';
import { loginUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';
import { EmailService } from '@posteve/nestjs-libraries/email/email.service';
import { SendMail } from '@posteve/nestjs-libraries/email/email.interface';
import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
import { AuthHelper } from '@posteve/nestjs-libraries/helper/auth/auth.helper';

@Controller('auth')
export class AuthController {
  constructor(
    private _userService: UserService,
    private _emailService: EmailService
  ) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const existingUser = await this._userService.findVerifiedUser({
        email: dto.email,
      });

      if (existingUser) {
        throw new BadRequestException('User already registered');
      }

      const { id } = await this._userService.createOrUpdateUser(dto);

      //create token and send to frontend/auth/verify?t=token
      //to verify send query token to backend/auth/verify?t=token
      const token = AuthHelper.signJWT({ id });

      const callback = `${process.env.FRONTEND_URL}/callback/verify?t=${token}`;

      const mail: SendMail = {
        to: `${dto.email}`,
        subject: 'verify your email.',
        html: `to continue, please veriy you email by <a href="${callback}">clicking here</a>`,
      };

      if (process.env.NODE_ENV !== 'production') {
        res.status(200).json(`${callback}`);
        return;
      }

      const { info } = await this._emailService.sendEmail(mail);

      return { info };

      // res.json({ token, mailInfo: info?.messageId });
    } catch (error) {
      const { code, ...err } = error;
      console.log({ code, err });
      return false;
      // throw new InternalServerErrorException(error);
    }
  }

  @Post('signin')
  async login(
    @Body() dto: loginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      // console.log({dto})
      const userInDb = await this._userService.getUserDetails(dto.email);
      if (!userInDb) {
        throw new NotFoundException('Verified User Not Found');
      }

      if (!AuthHelper.verifyHash(dto.password, userInDb.password)) {
        throw new ForbiddenException('Incorrect Credentials');
      }

      const token = AuthHelper.signJWT({ id: userInDb.id });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // console.log(token);
      res.json({ token }); //token sent for mobile dev headers
      return;
    } catch (error) {
      console.log({ error });
      // throw error;
      return false;
    }
  }

  @Get('verify')
  async activateUser(
    @Query('t') t: string,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      // await this._authService.activateUser(t);
      if (!t) {
        throw new NotFoundException('vefication token not found');
      }
      const { id: unVerifiedUserId } = AuthHelper.verifyJWT(t) as {
        id: string;
      };

      const { verified: isVerified } = await this._userService.findUser(
        unVerifiedUserId
      );
      if (!isVerified) {
        const { id: userId, verified } = await this._userService.activate(
          unVerifiedUserId
        );
        if (userId && verified) {
          console.log({ userId, verified });
          const token = AuthHelper.signJWT({ id: userId });
          res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 3600000,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log({ verifyUserError: error });
      // throw new InternalServerErrorException({
      //   error,
      //   err: 'verify errrorljsdfkjalsdf',
      // });
      return false;
    }
  }

  @Get('signout')
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.cookie('token', null, {
        httpOnly: true,
        maxAge: -1, //  it makes the cookie session-based
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      res.status(200);
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
}

/**
 * @Query return the object of all queries in obj
 * {t:"jsldj", key: "value"}
 * @Query('t') will return just value of t -> 'jsldj'
 */
