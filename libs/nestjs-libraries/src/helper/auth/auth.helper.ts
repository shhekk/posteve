import { ForbiddenException } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

export class AuthHelper {
  private static _secret: string = process.env['JWT_SECRET']!;

  constructor() {
    if (!AuthHelper._secret) {
      console.error(`JWT_SECRET is not defined in env variables`);
    }
  }

  static hashPassword(password: string) {
    return hashSync(password, 10);
  }

  static signJWT<T extends object>(obj: T) {
    return sign(obj, AuthHelper._secret);
  }

  static verifyHash(password: string, hash: string) {
    return compareSync(password, hash);
  }

  static verifyJWT(token: string) {
    try {
      return verify(token, AuthHelper._secret);
    } catch (error) {
      throw new ForbiddenException({
        message: error,
        msg: 'AuthHelper.verifyJWT error',
      });
    }
  }
}
