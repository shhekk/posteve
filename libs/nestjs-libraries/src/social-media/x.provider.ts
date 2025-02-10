import { createHmac } from 'crypto';
import OAuth from 'oauth-1.0a';
import { parse } from 'querystring';
import {
  AuthTokenBody,
  OAuthTokenBody,
  PostDetails,
  SocialAbstract,
  SocialProvider,
} from './platform.interface';

export class XProvider extends SocialAbstract implements SocialProvider {
  key = process.env['X_APP_KEY']!;
  secret = process.env['X_APP_SECRET']!;
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
  logoURL = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg';
  redirect_uri = process.env['FRONTEND_URL']! + `/connect/${this.identifier}`;
  scope: string[] = [];

  async getAuthUrl() {
    let url = new URL('https://api.x.com/oauth/request_token');
    url.searchParams.append('oauth_callback', this.redirect_uri);
    // url.searchParams.append('oauth_consumer_key', this.key);

    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({ url: url.href, method: 'POST' }, undefined)
    ).Authorization;

    console.warn('::::::auth header:', authHeader);
    const res = // await this.fetch<{ [key: string]: string }>(
      (
        await this.fetch<string>( //as OAuth 1.0a Responses Are URL-Encoded
          url.href,
          {
            method: 'POST',
            headers: {
              Authorization: authHeader,
            },
          },
          'x:getAuthUrl'
        )
      ).data;
    console.warn(':::::xapi getauthurl res:', res);
    const { oauth_token, oauth_token_secret, oauth_callback_confirmed } =
      this.parse(res);

    if (!oauth_token || !oauth_token_secret) {
      throw new Error('request token and secret not recieved from X api');
    }

    if (String(oauth_callback_confirmed) !== 'true') {
      throw new Error('something went wrong in X api');
    }

    url = new URL('https://api.x.com/oauth/authorize');
    url.searchParams.append('oauth_token', oauth_token);

    return {
      url: url.href,
      token: oauth_token + ':' + oauth_token_secret, //only use is weather callback_url get same token as this
    };
  }

  async authenticate(code: string, token: string): Promise<AuthTokenBody> {
    let url = new URL('https://api.x.com/oauth/access_token');
    url.searchParams.append('oauth_consumer_key', this.key);
    url.searchParams.append('oauth_token', token);
    url.searchParams.append('oauth_verifier', code);

    const res = await this.fetch<string>( //oauth1.0a send data in querystring
      url.href,
      {
        method: 'POST',
      },
      'x:authenticate'
    );

    // console.warn('::::success X-accesstoken milgya', { data: res.data });
    //data: 'oauth_token=1794502342342342496-S2342342342342ODG7k2YH9dn6ma9X&oauth_token_secret=NB23423423423428996969696969l59feIsyGXa10hTGC&user_id=1732324249954154496&screen_name=0x1abhishek'
    const { oauth_token, oauth_token_secret, user_id, screen_name } =
      this.parse(res.data);

    console.warn({ oauth_token, user_id, screen_name });

    return {
      accessToken: oauth_token + ':' + oauth_token_secret,
      id: user_id, //todo add internal id of the user here from get userdetails data
      expiresIn: '9999999999999',
    };
  }

  //todo create this function
  post = async (accessToken: string, data: PostDetails, urn: string) =>
    Promise<any>;

  parse(data: string, logger?: string) {
    //takes query-string, convert into parsed object: {token: 'aksdf', secret: 'adfasldk'}
    //queryString -> oauth_token=kjakuijfwe2fw&oauth_token_secret=alenwoei
    const parsedObj = parse(data);
    logger && console.log(logger, ': ', parsedObj);
    return parsedObj as { [key: string]: string };
  }
}

/**
 * notes from : https://docs.x.com/resources/fundamentals/authentication/oauth-1-0a/authorizing-a-request
 * why oauth 1.0a
 * Which application is making the request
 * Which user the request is posting on behalf of
 * Whether the user has granted the application authorization to post on the user’s behalf
 * Whether the request has been tampered by a third party while in transit
 *
 * To allow applications to provide this information, X’s API relies on the OAuth 1.0a protocol.
 * in oauth 1.0a the Authorization header contains multiple key-value pairs which give all the required information
 *
 * Authorization:' OAuth oauth\_consumer\_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth\_signature\_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0" '
 *
 * Collecting parameters
 *  header contains 7 key-value pairs, where the keys all begin with the string “oauth_”.
 *
 * 1.Consumer key ( oauth_consumer_key ): (x api key) identifies which application is making the request.(posteve in this case)
 *
 * 2.Nonce ( oauth_nonce ): parameter (is base64 encoding 32 bytes of random data) your application should generate for each unique request. X will use this value to determine whether a request has been submitted multiple times. *but any approach which produces a relatively random alphanumeric string should be OK here.
 *
 * 3.Signature ( oauth_signature ) contains a value which is generated by running all of the other request parameters and two secret values through a signing algorithm. The purpose of the signature is so that X can verify that the request has not been modified in transit, verify the application sending the request, and verify that the application has authorization to interact with the user’s account.
 *
 * 4.Signature method ( oauth_signature_method ): signature method used by X is HMAC-SHA1.
 *
 * 5.Timestamp ( oauth_timestamp ): indicates when the request was created (the number of seconds since the Unix epoch at the point the request is generated). X will reject requests which were created too far in the past, so it is important to keep the clock of the computer generating requests in sync with NTP.
 *
 * 6.Token ( oauth_token ): (access Token) typically represents a user’s permission to share access to their account with your application.
 *
 * 7.Version ( oauth_version ): should always be 1.0 for any request sent to the X API.
 *
 * 
 * Step 1: GET /platform/connect/x
 * POST oauth/request_token
 * oauth_callback="https%3A%2F%2FyourCallbackUrl.com"
 * oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w"
 * Response includes
 * oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0
 * oauth_token_secret=veNRnAWe6inFuo8o2u8SLLZLjolYDmDP7SzL0YfYI
 * oauth_callback_confirmed=true
 *
 * if oauthcallback==='true' => @return {url: https://api.x.com/oauth/authorize?oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0 , token: oauth_token}
 * *redirect user to url
 *
 *  after authorization callback_url recieves same token and a verifier in searchparams:
 *
 *  https://yourCallbackUrl.com?oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0&oauth_verifier=uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY
 *  {token: oauth_token , code: oauth_verifier } send kr server pe
 *
 * Step 2: POST /platform/connect/x
 *
 * POST /oauth/access_token
 * oauth_consumer_key=cChZNFj6T5R0TigYB9yd1w
 * oauth_token=token
 * oauth_verifier=code
 *
 * Response includes:
 * oauth_token=7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4
 * oauth_token_secret=PbKfYqSryyeKDWz4ebtY3o5ogNLG11WJuZBc9fQrQo
 *
 * store in db : token = oauth_token:oauth_token_secret
 *
 * To determine the identity of the user, use GET account/verify_credentials.
 *
 * Now you’ve obtained the user access tokens; you can use them to access certain APIs such as POST statuses/update to create Tweets on the users’ behalf.
 * authHeader :::::::
 * {
 *  Authorization: 'OAuth oauth_consumer_key="jl5ZiklodalassanljfSHEHd3", oauth_nonce="Wq1jlsdfksdjflodalassanjfVhLcA2Bu", oauth_signature="Gzwjsldjfllodalassan2QPiCRXLtck%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1733094486", oauth_token="1794505949954154496-SCXTUb4J3klodalassan4kl236ma9X", oauth_version="1.0"'
 * }
 *  which endpoint is allowed for which oauth version: https://developer.x.com/en/docs/authentication/guides/v2-authentication-mapping
 *
 *  forcallback -> refer to callback url's docs for rule of a callback_url.
 *  you need specify the callbackurl in project dashboard.
 *  can't use localhost todo try to use 127.0.0.1
 *  callback_url must be encoded
 */
