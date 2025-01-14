import { SentMessageInfo } from 'nodemailer';

export interface ProviderInterface {
  provider: string; //name to recognize
  sendEmail(sendmail: SendMail): Promise<SentMessageInfo>;
}

export interface SendMail {
  to: string | string[];
  subject: string;
  html: string;
  from?: { name: string; email: string };
}
