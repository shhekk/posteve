import {
  ArgumentMetadata,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class CustomFileValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) throw new NotFoundException('files not found.');
    if (!value.mimetype) return value;

    const maxSize = this.maxSize(value.mimetype);

    // console.log({value, maxSize}, ':::::::::maxsize');
    if (value.size > maxSize) {
      throw new BadRequestException('File is too longer than expected.');
    }
    return value;
  }

  private maxSize(mimetype: string) {
    if (mimetype.startsWith('video/')) {
      return 100 * 1024 * 1024; //100MB
    }
    if (mimetype.startsWith('image/')) {
      return 10 * 1024 * 1024; //10MB
    }
    throw new BadRequestException('File must be of type image or video');
  }
}

//in pipe you have the file where action needs to be taken
//vs in interceptor you get whole request or response
export class CustomFileFieldsInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest<Request>();
    console.log(
      req.file,
      '::::::::::::::::::files from custom file interceptor'
    );

    return next.handle();
  }
}

/**
 * {
  value: {
    fieldname: 'file',
    originalname: 'lordbobby.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 05 03 04 04 04 03 05 04 04 04 05 05 05 06 07 0c 08 07 07 07 07 0f 0b 0b 09 ... 22854 more bytes>,
    size: 22904
  },
  maxSize: 100000
  } :::::::::maxsize
 */
