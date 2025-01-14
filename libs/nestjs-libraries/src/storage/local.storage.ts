import { StorageInterface } from './storage.interface';
import 'multer';
import fs from 'fs';
import path from 'path';

// @todo complete LocalStorage
export class LocalStorage implements StorageInterface {
  constructor() {}

  async uploadFile(file: Express.Multer.File) {
    return new Promise((res, rej) => {
      const ext = file.mimetype.split('/')[1];
      const filePath = path.join(
        process.cwd(),
        'assets',
        'localStorage',
        `${Math.floor(Math.random() * 10 ** 8) + '.' + ext}`
      );
      try {
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            rej(`local storage provider error: ${err.message}`);
          }
          res({url: filePath});
        });
      } catch (error) {
        console.log(error);
        rej('local storage provider error');
      }
    });
  }
}
