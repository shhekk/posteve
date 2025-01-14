import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello APIiiiii testing....' };
  }
}
