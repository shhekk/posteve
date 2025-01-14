/**
 * save accesstoken in db
 * if accesstoken expires it will throw error
 * read error according to that restore access token
 * per user per 2-hours there will be 1 request to database.
 */
import got from 'got';
import { createHmac } from 'crypto';
import OAuth from 'oauth-1.0a';
import { parse } from 'querystring';

export class XProvider2 {
  async post(requestToken) {
    const token = {
      key: oauth_token,
      secret: oauth_token_secret,
    };

    const authHeader = oauth.toHeader(
      oauth.authorize(
        {
          url: endpointURL,
          method: 'POST',
        },
        token
      )
    );
  }

  //for user behalf access  //returns accesstoken
  async auth(
    //get oauth token from getRequestToken()
    requestToken: string,
    requestTokenSecret: string,
    verifier: string //it is the pin sent to user during authorization
  ) {
    const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
    // to get this {Authorization:'key:"value",key2:"value2",key3:"value3"'}
    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: accessTokenURL,
        method: 'POST',
      })
    );
    const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${requestToken}`;
    const req = await got.post(path, {
      headers: {
        Authorization: authHeader['Authorization'],
        // Authorization: 'key: "value" ,key2 : "value2"',
      },
    });

    if (req.body) {
      return parse(req.body); //returns accessToken
    } else {
      throw new Error('Cannot get an OAuth request token');
    }
  }

  async getAuthUrl() {
    const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
    const oAuthRequestToken = await this.getRequestToken();

    authorizeURL.searchParams.append(
      'oauth_token',
      oAuthRequestToken['oauth_token'] as string
    );

    const url = authorizeURL.href;

    return url; //send this url to user to authorize the app
  }

  //get req token for representing you app
  async getRequestToken() {
    const oauth = this.oauth;
    const requestTokenURL =
      'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';

    const authHeader = oauth.toHeader(
      oauth.authorize({
        url: requestTokenURL,
        method: 'POST',
      })
    );

    const req = await got.post(requestTokenURL, {
      headers: {
        Authorization: authHeader['Authorization'],
      },
    });

    if (req.body) {
      return parse(req.body); //returns parsedString with oauth token/secret(app request token)
    } else {
      throw new Error('Cannot get an OAuth request token');
    }
  }

  private oauth = new OAuth({
    consumer: {
      key: process.env.X_APP_KEY!,
      secret: process.env.X_APP_SECRET!,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) =>
      createHmac('sha1', key).update(baseString).digest('base64'),
  });

  parse(body: string) {
    const parsedObj = parse(body) as {
      oauth_token: string;
      oauth_token_secret: string;
      oauth_callback_confirmed: string;
    };
    return parsedObj;
  }
}
