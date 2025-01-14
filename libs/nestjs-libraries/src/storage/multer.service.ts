import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable({})
export class MulterService {
  // bsdk multer kyu chahiye when you have
  @UseInterceptors(FileInterceptor('file'))
  async getFileToServer(@UploadedFile() file: Express.Multer.File) {
    // send file to cloudinary service
  }
}

//i don't even need module just make a service and add it to api module
//when you need upload.module - if i had multiple CDN providers to store image -

//or 

//you can make a local provider for local development where you will store the path of file in local machine in database as media_url/local path
// put you images in app/assests/img.name and store in local development
// save cloudinary space
