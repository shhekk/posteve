// import { Body, ForbiddenException, Injectable } from '@nestjs/common';
// import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
// import {
//   CreateUserDto,
//   loginUserDto,
// } from '@posteve/nestjs-libraries/dtos/user.dto';
// import { AuthHelper } from '@posteve/nestjs-libraries/helper/auth/auth.helper';
// import { Response } from 'express';

// @Injectable({})
// export class AuthService {
//   constructor(private _userService: UserService) {}

//   async checkHealth(res: Response) {
//     res.cookie('token', process.env.JWT_SECRET!, {
//       maxAge: 200000,
//       httpOnly: true,
//     });
//     return 'user registered ';
//   }

//   // async register(@Body() dto: CreateUserDto) {
//   //   const existingUser = await this._userService.findUser(dto.email);
//   //   if (existingUser) throw new ForbiddenException('user already exist');

//   //   return 'chal be chutiye kya likha tha ye';
//   //   // const user = await this._userService.createUser(dto);

//   //   // const token = AuthHelper.signJWT(user);

//   //   // return token;
//   // }

//   async activateUser(token: string) {
//     const { id, verified } = AuthHelper.verifyJWT(token) as {
//       id: string;
//       verified: boolean;
//     };

//     const user = await this._userService.findUser(id);
//     if (!user?.verified && !verified) {
//       await this._userService.activate(id);

//       return;
//     }
//     return false;
//   }

//   async login(@Body() dto: loginUserDto) {
//     const { email, password } = dto;
//     const user = await this._userService.getUserDetails(email);

//     if (user && user.verified) {
//       const isAuth = AuthHelper.verifyPassword(password, user?.password);

//       if (isAuth) {
//         const token = AuthHelper.signJWT(user);
//         return token;
//       }
//     }
//     return false;
//   }
// }
