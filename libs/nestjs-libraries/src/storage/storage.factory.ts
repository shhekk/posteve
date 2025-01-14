// idea of storage provider is to get the storage instance without worring which storage to use
// ki phle se sare storage define kr do aur .env me storage provider ka naam rkh do
//  uske according switch case use kr ke storage instance dedo developer ko
import { Injectable } from '@nestjs/common';
import { CloudinaryStorage } from './cloudinary.storage';
import { LocalStorage } from './local.storage';
import { StorageInterface } from './storage.interface';

@Injectable({})
export class StorageFactory {
  private _client: StorageInterface;

  constructor() {
    this._client = this.CreateStorage(
      process.env['STORAGE_PROVIDER'] || 'local'
    );
  }

  private CreateStorage(provider: string) {
    switch (provider) {
      // @todo LocalStorage
      case 'local': {
        return new LocalStorage();
      }
      case 'cloudinary': {
        console.log('cloudinary storage provided');
        return new CloudinaryStorage();
      }
      default: {
        throw new Error('No Storage Provider provided in .env');
      }
    }
  }

  async uploadFile(file: Express.Multer.File){
    // console.log('control reach uplodfile storagefactory');
    return await this._client.uploadFile(file);
  }
}

// import { CloudinaryStorage } from './cloudinary.storage';
// import { LocalStorage } from './local.storage';

// export class StorageFactory {
//   provider: string = process.env['STORAGE_PROVIDER']!;
//   private _client;

//   constructor() {
//     this._client = this.CreateStorage(this.provider);
//   }

//   async CreateStorage(provider: string) {
//     switch (provider) {
//       // @todo LocalStorage
//       case 'local': {
//         return new CloudinaryStorage();
//       }
//       case 'cloudinary': {
//         return new CloudinaryStorage();
//       }
//       default: {
//         throw new Error('No StorageProvider provided in .env');
//       }
//     }
//   }
// }
