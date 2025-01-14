//do all media / image / upload related services here
import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileValidationPipe } from '@posteve/nestjs-libraries/storage/fileValidation';
import { StorageFactory } from '@posteve/nestjs-libraries/storage/storage.factory';

@Controller('media')
export class MediaController {
  constructor(private _storage: StorageFactory) {}

  //upload all files here first and send url of the media
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(CustomFileValidationPipe)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) throw new NotFoundException();
      const { url } = await this._storage.uploadFile(file);
      return { url };

      // const fils = path.join(__dirname, '')
      // const { buffer, ...rest } = file;
      // return { rest, fils, cwd: process.cwd() };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
