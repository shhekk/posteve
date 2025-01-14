import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { StorageInterface } from './storage.interface';

@Injectable({})
export class CloudinaryStorage implements StorageInterface {
  private _client;

  constructor() {
    this._client = v2;
    this._client.config({
      api_key: process.env['CLOUDINARY_API_KEY']!,
      api_secret: process.env['CLOUDINARY_API_SECRET']!,
      cloud_name: process.env['CLOUDINARY_CLOUD_NAME']!,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    return await new Promise((resolve, reject) => {
      this._client.uploader
        .upload_stream({ folder: 'posteve' }, (error, uploadResult) => {
          if (error) {
            reject(new InternalServerErrorException({ error }));
          }
          resolve(uploadResult);
        })
        .end(file.buffer);
    });
  }

  // @todo make a deleteFile function in future to save space(after the post is posted in social media delete the file from cloudinary)
}
