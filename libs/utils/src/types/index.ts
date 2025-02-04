import { SocialProvider } from '@posteve/nestjs-libraries/social-media/platform.interface';

export type PlatformLists = Array<
  Pick<SocialProvider, 'title' | 'identifier' | 'logoURL'> & {
    [key: string]: string;
  }
>;
// example
// const as: PlatformLists = [
//   {
//     identifier: 'x',
//     title: 'X',
//     logoURL: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg',
//   },
//   {
//     identifier: 'linkedin',
//     title: 'Linkedin',
//     logoURL:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png',
//   },
// ];

// type asdf = {
//   asdf: string;
//   [key: string]: string;
// };
// const a: asdf = {
//   asdf: 'aj',
// };

// const asdf: PlatformLists = [
//   { identifier: '', logoURL: '', title: '', key: 'kdjsldjf' },
// ];
