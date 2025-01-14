import { Global, Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { AuthService } from '../auth/auth.service';
import { StorageModule } from '../storage/upload.module';

@Global()
@Module({
  // imports: [StorageModule], //it is already a global module added in appModule
  controllers: [],
  providers: [EmailService, AuthService],
  get exports() {
    return this.providers;
  },
})
export class NestjsLibrariesModule {}

//explore this file it will make app.module so lighter
