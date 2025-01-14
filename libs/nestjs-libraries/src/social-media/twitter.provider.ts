import axios from 'axios';
import { createHmac } from 'crypto';
import OAuth from 'oauth-1.0a';
import { parse } from 'querystring';
import {
  OAuthTokenBody,
  PostDetails,
  SocialAbstract,
  SocialProvider,
} from './platform.interface';

export class TwitterProvider extends SocialAbstract implements SocialProvider {
  private oauth = new OAuth({
    consumer: {
      key: process.env['X_APP_KEY']!,
      secret: process.env['X_APP_SECRET']!,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) =>
      createHmac('sha1', key).update(baseString).digest('base64'),
  });
  identifier = 'x';
  redirect_uri = process.env['FRONTEND_URL']! + `/connect/${this.identifier}`;
  scope: string[] = [];
  // constructor() {
  // super();
  // this.oauth = new OAuth({
  //   consumer: {
  //     key: process.env.X_APP_KEY!,
  //     secret: process.env.X_APP_SECRET!,
  //   },
  //   signature_method: 'HMAC-SHA1',
  //   hash_function: (baseString, key) =>
  //     createHmac('sha1', key).update(baseString).digest('base64'),
  // });
  // }

  async post(accessToken: string, data: PostDetails) {
    const [key, secret] = accessToken.split(':');
    const token = {
      key,
      secret,
    };
    const tweetEndpointURL = `https://api.twitter.com/2/tweets`;

    const authHeader = this.oauth.toHeader(
      this.oauth.authorize(
        {
          url: tweetEndpointURL,
          method: 'POST',
        },
        token
      )
    );
    // console.log('authHeader :::::::\n', authHeader);
    //use this authHeader and post

    return (
      await this.fetch(
        tweetEndpointURL,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader.Authorization,
            'User-Agent': 'v2CreateTweetJS',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          data,
        },
        'x:post:tweetingPost'
      )
    ).data;
  }

  async getAuthUrl() {
    const { oauth_token } = await this.getRequestToken();
    const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
    authorizeURL.searchParams.append('oauth_token', oauth_token);
    // sendt url to user to authorize posteve
    return { url: authorizeURL.href, token: oauth_token };
  }

  //async authenticate (code: string, token?: string):Promise<authtokenbody>
  async authenticate(code: string, token: string) {
    //send url to user and get a verifier pin.
    const accessTokenURL = 'https://api.twitter.com/oauth/access_token';

    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: accessTokenURL,
        method: 'POST',
      })
    );

    // const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${requestToken}`;
    const path = new URL(accessTokenURL);
    path.searchParams.append('oauth_verifier', code);
    path.searchParams.append('oauth_token', token);

    const res = await this.fetch(
      path.href,
      {
        headers: {
          Authorization: authHeader.Authorization,
        },
      },
      `${this.identifier}:authenticate:fetch-access-token`
    );

    const { oauth_token, oauth_token_secret } = this.parse(res.data);
    return {
      accessToken: `${oauth_token}:${oauth_token_secret}`,
      id: '', //or you can fetch user details
      expiresIn: '999999999', //as required in AuthTokenBody interface
    };
  }

  async getRequestToken() {
    const requestTokenURL =
      'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';

    //create a OAuth authentication header
    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: requestTokenURL,
        method: 'POST',
      })
    );

    const res = await axios.post(requestTokenURL, null, {
      headers: {
        Authorization: authHeader.Authorization,
      },
    });

    if (res.data) {
      return this.parse(res.data, 'request Token response'); //returns request token/secret //oauth_token=xx&oauth_token_secret=xx&oauth_callback_confirmed=true
    } else {
      throw new Error('OAuth RequestToken not arrived');
    }
  }

  parse(data: string, logger?: string) {
    //queryString -> oauth_token=kjakuijfwe2jjkljjIJLKjjIJDjfisofw&oauth_token_secret=alkdjfiwoewkenwoei&oauth_confirmed_e
    //twitter api sends oauthToken details in querystring in body
    //takes query-string, convert into parsed object
    const parsedObj = parse(data); //returns request token/secret
    logger && console.log(logger, ': ', parsedObj);
    return parsedObj as OAuthTokenBody;
  }
}

/**
 authHeader :::::::
 {
  Authorization: 'OAuth oauth_consumer_key="jl5ZiklodalassanljfSHEHd3", oauth_nonce="Wq1jlsdfksdjflodalassanjfVhLcA2Bu", oauth_signature="Gzwjsldjfllodalassan2QPiCRXLtck%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1733094486", oauth_token="1794505949954154496-SCXTUb4J3klodalassan4kl236ma9X", oauth_version="1.0"'
}
  which endpoint is allowed for which oauth version: https://developer.x.com/en/docs/authentication/guides/v2-authentication-mapping
  
  forcallback -> refer to callback url's docs for rule of a callback_url.
  you need specify the callbackurl in project dashboard.
  can't use localhost todo try to use 127.0.0.1
  callback_url must be encoded
 */
