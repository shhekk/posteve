import { Injectable } from '@nestjs/common';
import { ProviderInterface, SendMail } from './email.interface';
import { NodeMailerService } from './nodemailer.provider';

@Injectable({})
export class EmailService {
  private _emailProvider: ProviderInterface;
  constructor() {
    this._emailProvider = this.getProvider(
      process.env.EMAIL_PROVIDER!.toLowerCase()
    );

    // this._emailProvider = new NodeMailerService();
  }

  getProvider(provider: string) {
    switch (provider) {
      case 'nodemailer': {
        return new NodeMailerService();
      }
      case 'resend': {
        return new NodeMailerService();
      }
      case 'sendgrid': {
        return new NodeMailerService();
      }
      default: {
        throw new Error('a email provider is not specified in .env');
      }
    }
  }

  async sendEmail(mail: SendMail) {
    return await this._emailProvider.sendEmail(mail);
  }
}
