import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
import { GetUser } from '@posteve/nestjs-libraries/user/user.from.request';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('me')
  async me(@GetUser() user: User) {
    // console.log({ user });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...details } = user;
    return details;
  }
}
