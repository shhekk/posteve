// refer - https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md
import { TwitterApi } from 'twitter-api-v2';

// flow : intController -> intManager  -> socialproviders(x, insta, yt, ...etc)

export class XProvider {
  private _client;
  private identifier = 'x'
  redirect_uri = process.env['FRONTEND_URL']! + `/connect/${this.identifier}`;

  constructor() {
    this._client = new TwitterApi({
      // appKey: process.env.X_APP_KEY!,
      // appSecret: process.env.X_APP_SECRET!,
      clientId: process.env['X_APP_KEY']!,
      clientSecret: process.env['X_APP_SECRET']!,
    });
  }

  async generateOAuth2AuthLink() {
    // const client = new TwitterApi({
    //   clientId: process.env.X_APP_KEY!,
    //   clientSecret: process.env.X_APP_SECRET!,
    // });
    const { url, codeVerifier, state } = this._client.generateOAuth2AuthLink(
      'http://localhost:4000/oauth2',
      {
        scope: ['tweet.write'],
      }
    );
    //save store and codeVerifier
    //redirect user to url
    return { url, codeVerifier, state };
    //use this in you  callback_url
    // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/auth.md#collect-returned-auth-codes-and-get-access-token
  }

  async generateAuthLink() {
    const authLink = await this._client.generateAuthLink('oob', {
      authAccessType: 'write',
    });
    const { url, oauth_token, oauth_token_secret } = authLink;
    console.log(authLink);

    return {
      url,
      oauth_token,
      oauth_token_secret,
    };
  }
}

interface SocialMediaProviders {
  getToken(): Promise<string>;

  getAuthUrl(): Promise<any>;

  post(): Promise<any>;
}

/**
 * notes Twitter-api-v2
 * many endpoints use OAuth 1.0a method to act on behalf of Twitter account
 * initiate a client
 * const client = new TwitterApi({ appKey: CONSUMER_KEY, appSecret: CONSUMER_SECRET });
 *
 * User authentication (3-legged OAuth 1.0a flow)
 * it is named 3 legged because it have 3 steps - 1. you send authLink to user and get temp acc. token 2.
 * * *1. create AuthLink and get AccessToken
 * const authLink = await client.generateAuthLink(x);
 * authLink.url -> send this url to client
 * x is optional args
 * x = CALLBACK_URL ( redirect user to this url after Authentication ), {linkmode: 'authenticate'(default) or 'authorize'}()
 * without cburl user will get a outh_verifier_token will be given which user have to manually enter in the app
 * if cburl => cburl/?oauth_token=alksflsj&oauth_token_secret=lkdjkfalksj  twitter adds two query params and oauth_token_secret is in session(req.session)
 *  const { oauth_token, oauth_verifier } = req.query;
 *  const { oauth_token_secret } = req.session;
 *
 * 2. send url to client which gives VerifierToken.
 * const url = authLink.url;
 *
 * const {oauth_token , oauth_token_secret} = authLink  // save these
 *
 * 3.
 */

// // Instantiate with desired auth type (here's Bearer v2 auth)
// const twitterClient = new TwitterApi('<YOUR_APP_USER_TOKEN>');

// // Tell typescript it's a readonly app
// const readOnlyClient = twitterClient.readOnly;

// // Play with the built in methods
// const user = await readOnlyClient.v2.userByUsername('plhery');
// await twitterClient.v2.tweet('Hello, this is a test.');
// // You can upload media easily!
// await twitterClient.v1.uploadMedia('./big-buck-bunny.mp4');
//vim commands gu-lowercase uptomotion  gU-uppercase uptomotion
