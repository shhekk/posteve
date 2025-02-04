import axios from 'axios';
import fs from 'fs';
import { lookup } from 'mime-types';

export interface OAuthTokenBody {
  oauth_token: string;
  oauth_token_secret: string;
  [key: string]: any; //called an index signature // Allow additional properties if needed //this line is magic remove and see why
}

export interface AuthTokenBody {
  id: string; //urn
  accessToken: string; //some provider have secret some havenot. if somehave secret store it like : accesstoken-> token:secret
  //use slice(:) to get token and secret
  expiresIn: string; //but comes in seconds / number use-> String()
  refreshToken?: string;
}

export interface SocialProvider extends SocialAbstract {
  title: string;
  logoURL: string;
  //required for frontend as, renders supported platforms title and logo in DOM
  identifier: string;
  scope?: string[];
  redirect_uri?: string;
  // getRequestToken: () => Promise<OAuthTokenBody>; // return app key/secret
  getAuthUrl: () => Promise<{ url: string; token?: string }>; //twitter returns token also
  authenticate: (code: string, token: string) => Promise<AuthTokenBody>; // return accesstoken to post on behalf of user
  renewAccessToken?: (refreshToken: string) => Promise<AuthTokenBody>;
  post: (accessToken: string, data: PostDetails, urn: string) => Promise<any>;
}

export interface Media {
  type: 'IMAGE' | 'VIDEO';
  url: string;
  title?: string; // required for shaping linkedin post
  description?: string; //if there is no string just put ''
}

export interface PostDetails {
  text: string;
  media?: Media[];
  // media?: Media[];  this is the array of media which raise a lot of changes. can use .map()
}

//put all comman methods here to acheive abstraction.(use extends keyword to use this class)
export abstract class SocialAbstract {
  async fetch<T = any>(
    url: string,
    options: axios.AxiosRequestConfig,
    identifier: string
  ) {
    //the only use of this function is it gurantees a successfull result.
    const res = await axios<T>(url, {
      ...options,
      validateStatus: () => true, //allow all status code to pass without throwing error.
      //this way it let me handle error myself
    });
    if (res.status === 200 || res.status === 201) return res;
    if (res.status === 429) {
      const err = 'Rate limit excedded';
      throw new fetchError(res.data, 429, err, identifier);
    }

    //using Error('only string can be pass here') so i made my own class which will be passed to catch(obj)
    //use this as catch(err) err.status, err.statustext, ...
    throw new fetchError(res.data, res.status, res.statusText, identifier);
    /**
     * for identifier you can use this format:
     * '{identifier}:{MethodName}:{explain function inshort}'
     *
     * catch (err) will log this fetchError{err: 429, msg: 'error exited with 429', identifier:'x:post:tweetingpost'}
     */
  }

  protected async fetchFromLocalStorage(url: string, identifier?: string) {
    const file = fs.readFileSync(url);
    if (!file) {
      throw new cloudinaryError(
        'localstorageError',
        500,
        'not found',
        `${identifier}`
      );
    }
    const mimeType = lookup(url) || 'false';
    return { assetBuffer: file.buffer as any, mimeType };
  }

  /**get mime type of file from cloudinary URL
   * @param url
   * @return file and mimetype
   */
  async fetchFromCloudinary(
    url: string,
    identifier?: string
  ): Promise<{ assetBuffer: any; mimeType: string }> {
    if (!process.env['STORAGE_PROVIDER']) {
      return await this.fetchFromLocalStorage(url);
    }
    const res = await axios(url, {
      method: 'GET',
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });
    if (res.status === 200 || res.status === 201) {
      let obj: { assetBuffer: any; mimeType: string } = {
        assetBuffer: res.data,
        mimeType: 'false', //if data is not in image or video false and post will be cancled
      };
      const { 'Content-Type': contentType } = res.headers;
      const mimetype = lookup(url);

      if (contentType) {
        obj.mimeType = contentType as string;
      } else if (mimetype) {
        obj.mimeType = mimetype;
      }

      return obj;
    }
    throw new cloudinaryError(
      res.data,
      res.status,
      res.statusText,
      `${identifier}:cloudinaryError`
    );
  }
}
class fetchError {
  constructor(
    public error: any,
    public status: number,
    public msg: string,
    public identifier: string
  ) {}
}
class cloudinaryError {
  constructor(
    public error: any,
    public status: number,
    public msg: string,
    public identifier: string
  ) {}
}
