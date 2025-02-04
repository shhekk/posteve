import { OAuthTokenBody, SocialProvider } from './platform.interface';

export class FacebookProvider implements SocialProvider {
  private identifier = 'facebook';
  title = 'Facebook';
  logoURL = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png';
  instaLogoURL = 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg'; //jb insta add ho tb kr liyo
  linkedinPage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png';
  constructor() {}
}
