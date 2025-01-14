import {
  Injectable,
  NestMiddleware,
  InternalServerErrorException,
  UnauthorizedException,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '@posteve/nestjs-libraries/database/prisma/user/user.service';
import { AuthHelper } from '@posteve/nestjs-libraries/helper/auth/auth.helper';
import { Observable } from 'rxjs';

@Injectable({})
export class AuthMiddleware implements NestMiddleware {
  //@todo on every user request we have to fetch data from database
  //make it efficient by caching user details.(Redis)
  constructor(private _userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // console.log({ cookies: req.cookies?.token });
    const token = req.cookies?.token || req.headers?.['auth'];
    // console.log('auth: ', token);

    if (!token) throw new UnauthorizedException('token not found.');

    try {
      const decoded = AuthHelper.verifyJWT(token) as {
        id: string;
      };

      if (decoded) {
        const user = await this._userService.getUserDetails(decoded.id);
        // console.log(user);
        if (!user) {
          throw new UnauthorizedException('user is unauthenticated...');
        }

        // req.user = user;
        // @ts-ignore
        req['user'] = user;
        next();
      } else {
        throw new UnauthorizedException('User is not verified');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ lund: '', error });
    }
  }
}

// export class AuthInterceptor implements NestInterceptor {
//   constructor(private _userService: UserService) {}
//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>
//   ): Observable<any> | Promise<Observable<any>> {
//     const req = context.switchToHttp().getRequest<Request>();

//     const token = req.cookies?.token || req.headers['auth'];

//     if (!token) throw new UnauthorizedException('token not found.');

//     const decoded = AuthHelper.verifyJWT(token) as {
//       id: string;
//       verified: boolean;
//     };

//     const user = await this._userService.getUserDetails(decoded.id);
//     console.log(user);

//     if (!user) {
//       throw new UnauthorizedException('user is unauthenticated...');
//       // req.user = user;
//     }

//     // @ts-ignore
//     req['user'] = user;
//     return next.handle();
//   }
// }
