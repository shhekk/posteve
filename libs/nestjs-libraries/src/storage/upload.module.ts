import { Global, Module } from '@nestjs/common';
import { CloudinaryStorage } from './cloudinary.storage';
import { StorageFactory } from './storage.factory';

@Global()
@Module({
  // providers: [CloudinaryStorage],
  providers: [StorageFactory],
  exports: [StorageFactory],
})
export class StorageModule {}

/**
 * @Ideas
 * 1. there should be a limit to post per month
 * 2. provoke users to share this application
 *    if their share get 5 registers permit them more post to upload for this month
 * 3. set limited icons for user dp and save extra cloudinary-space -> save dp id in db
 */
