import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { createTransport, SentMessageInfo, TransportOptions } from 'nodemailer';
import nodemailer from 'nodemailer';
import { ProviderInterface, SendMail } from './email.interface';

const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  service: 'gmail',

  port: +process.env.EMAIL_PORT! || 465,
  // port: process.env.PORT || 465, //throws error as port is string
  // port: process.env.PORT!.toString() || 465,  //  or do this

  secure: process.env.EMAI_PORT! === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

@Injectable({})
export class NodeMailerService implements ProviderInterface {
  provider = 'nodemailer';

  async sendEmail(sendMail: SendMail) {
    const { html, subject, to, from } = sendMail;
    const info = await transporter.sendMail({
      from: from
        ? `${from.name} <${from.email}>`
        : '"posteve" <verification@posteve.com>', // sender address
      to,
      subject,
      text: html,
      html,
    });

    return info;
  }
}

// interface A {
//   a: string;
//   b(): void;
//   c: () => void;
// }

interface C {
  greet(): void;
}

class B {
  b: string;
  constructor(b: string) {
    this.b = b;
  }
  sayHello() {
    console.log('Hello from B', this.b);
  }
}

class A extends B implements C {
  constructor(b: string) {
    super(b);
  }
  greet() {
    console.log('Hello from A');
  }
}

const a = new A('lsdkjfald');
a.sayHello(); // From class B
a.greet(); // From class A
