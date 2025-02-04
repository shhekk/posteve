import {
  PostDetails,
  SocialAbstract,
  SocialProvider,
} from './platform.interface';

export class LinkedinProvider extends SocialAbstract implements SocialProvider {
  title = 'Linkedin';
  logoURL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png';
  identifier = 'linkedin';
  scope = ['openid', 'profile', 'w_member_social', 'email'];
  key = process.env['LINKEDIN_KEY']!;
  secret = process.env['LINKEDIN_SECRET']!;
  redirect_uri = process.env['FRONTEND_URL']! + `/connect/${this.identifier}`;

  async getAuthUrl() {
    const path = new URL('https://www.linkedin.com/oauth/v2/authorization');
    path.searchParams.append('client_id', this.key);
    path.searchParams.append('redirect_uri', this.redirect_uri); // use frontendURL/callback/linkedin  here you will get "code" in query
    path.searchParams.append('response_type', 'code');
    path.searchParams.append('scope', this.scope.join(' '));

    // return { url: path.href, token: '' };
    return { url: path.href };
  }

  async authenticate(code: string) {
    // type LinkedinResType = Pick<
    //   AuthTokenBody,
    //   'accessToken' | 'expiresIn' | 'refreshToken'
    // >;
    // type omits = Omit<AuthTokenBody, 'id'>;
    const path = 'https://www.linkedin.com/oauth/v2/accessToken';

    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('client_id', this.key);
    data.append('client_secret', this.secret);
    data.append('redirect_uri', this.redirect_uri);

    const { access_token, expires_in, refresh_token } = <
      {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        [key: string]: any;
      }
    >(
      await this.fetch(
        path,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data,
        },
        'linkedin:authenticate'
      )
    ).data;

    // https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2?context=linkedin%2Fconsumer%2Fcontext#api-request-to-retreive-member-details

    const { sub: id } = (
      await this.fetch(
        'https://api.linkedin.com/v2/userinfo',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
        this.identifier
      )
    ).data;

    return {
      id, //https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns#urns
      accessToken: access_token,
      expiresIn: String(Date.now() + expires_in * 1000),
      refreshToken: refresh_token,
    };
    //@todo while fetching this accesstoken from database do check it is expired, only fetch if it is not expired
    //logic -> save expireIn  =  expires_in + date.now()
    //if expireIn > date.now() then accessToken is expired
    //use Authorization: `Bearer ${accessToken}` in headers to post
  }

  //https://learn.microsoft.com/en-us/linkedin/media/static-refresh-tokens.png
  async renewAccessToken(refreshToken: string) {
    const path = 'https://www.linkedin.com/oauth/v2/accessToken';

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', this.key);
    params.append('client_secret', this.secret);

    const p = encodeURI(
      `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${this.key}&client_secret=${this.secret}`
    );

    //this gurantees a successfull response -> one trycath at controller level will be enough to catch what
    //@todo apply this.fetch in twitter.provider.ts
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: newRefreshToken,
    } = <
      {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        [key: string]: any;
      }
    >(
      await this.fetch(
        path,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          //if params.tostring() fails use p as data
          data: params.toString(),
        },
        this.identifier
      )
    ).data;
    const { sub: id } = <{ sub: string }>(
      await this.fetch(
        'https://api.linkedin.com/v2/userinfo',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        this.identifier
      )
    ).data;

    return {
      id, //store in internalId in db
      accessToken,
      expiresIn: String(expiresIn * 1000), //linkedin returns in seconds , convert into miliseconds
      refreshToken: newRefreshToken,
    };
  }

  async registerAssets(
    urn: string,
    accessToken: string,
    type: 'IMAGE' | 'VIDEO'
  ) {
    const path = 'https://api.linkedin.com/v2/assets?action=registerUpload';
    const data = {
      registerUploadRequest: {
        recipes: [`urn:li:digitalmediaRecipe:feedshare-${type}`],
        owner: `urn:li:person:${urn}`,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent',
          },
        ],
      },
    };

    const {
      value: {
        uploadMechanism: {
          'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
            uploadUrl,
          },
        },
        asset,
      },
    } = (
      await this.fetch(
        path,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
          data,
        },
        'linkedin:registerAssets'
      )
    ).data;

    return { uploadUrl, asset };
  }

  async post(accessToken: string, post: PostDetails, urn: string) {
    let assetURN: string[] = [];
    if (post.media && post.media?.length > 0) {
      //https://www.youtube.com/watch?v=c3eNcjoJYRE  (all media should upload at once or throw error)
      // const p1 = new Promise((res, rej) => {});
      assetURN = await Promise.all(
        post.media.map(
          async (m, index) =>
            new Promise<string>(async (res) => {
              //get asset, uploadURl, and media buffer from cloudinary->upload media in url and res(asset)
              const { asset, uploadUrl } = await this.registerAssets(
                urn,
                accessToken,
                m.type
              );
              const { assetBuffer, mimeType } = await this.fetchFromCloudinary(
                m.url,
                `linked:postfetch:${index + 1}`
              );
              await this.fetch(
                uploadUrl,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${accessToken}`, //https://www.youtube.com/watch?v=br8VB99qPzE  buffer vs steream
                    Accept: 'application/octet-stream', //upload binary data
                    'Content-Type': mimeType,
                    'X-Restli-Protocol-Version': '2.0.0',
                  },
                  data: assetBuffer,
                },
                'linkedin:post:upload-binary-linkedin'
              );
              //on successfull post
              res(asset);
            })
        )
      );
    }

    console.log(assetURN, ':::::::::assetURN should be string[]');

    //step3. create media share. identify your media as asset urn
    // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api?view=li-lms-unversioned&tabs=http#sharecontent
    const data = {
      author: `urn:li:person:${urn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post.text, //content
          },
          ...(post.media && post.media.length > 0
            ? {
                shareMediaCategory: post.media[0].type as 'IMAGE' | 'VIDEO', //try RICH -> img or vid(for now all media should be same type)
                media: post.media.map((m, i) => ({
                  status: 'READY',
                  media: assetURN[i],
                })),
              }
            : { shareMediaCategory: 'NONE' }),
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    console.log(data, ':::::::::::::data ');
    console.log(JSON.stringify(data, null, 2), ':::::::::stringigy data');
    console.log(assetURN, ':::::::::::::assetsUrns');

    const res = await this.fetch(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        data,
      },
      'linkedin:post:ugcPosts-final-post-method'
    );
    return res.data;
  }
}

//testurl = 'https://res.cloudinary.com/dglr3zicv/image/upload/v1723882882/fioj93zou3ij0xwciylq.jpg',
