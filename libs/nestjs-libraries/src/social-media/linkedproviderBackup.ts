// import {
//     PostDetails,
//     SocialAbstract,
//     SocialProvider,
//   } from './platform.interface';
  
//   export class LinkedinProvider extends SocialAbstract implements SocialProvider {
//     identifier = 'linkedin';
//     scope = ['openid', 'profile', 'w_member_social', 'email'];
//     //wmembersocial -> lets you post on user behalf
//     //openid ->
//     key = process.env['LINKEDIN_KEY']!;
//     secret = process.env['LINKEDIN_SECRET']!;
//     redirect_uri = 'http://127.0.0.1:2020/callback/linkedin';
  
//     async getAuthUrl() {
//       const path = new URL('https://www.linkedin.com/oauth/v2/authorization');
//       path.searchParams.append('client_id', this.key);
//       path.searchParams.append('redirect_uri', this.redirect_uri); // use frontendURL/callback/linkedin  here you will get "code" in query
//       path.searchParams.append('response_type', 'code');
//       path.searchParams.append('scope', this.scope.join(' '));
  
//       // return { url: path.href, token: '' };
//       return { url: path.href };
//     }
  
//     async authenticate(code: string) {
//       // type LinkedinResType = Pick<
//       //   AuthTokenBody,
//       //   'accessToken' | 'expiresIn' | 'refreshToken'
//       // >;
//       // type omits = Omit<AuthTokenBody, 'id'>;
//       const path = 'https://www.linkedin.com/oauth/v2/accessToken';
  
//       const data = new URLSearchParams();
//       data.append('grant_type', 'authorization_code');
//       data.append('code', code);
//       data.append('client_id', this.key);
//       data.append('client_secret', this.secret);
//       data.append('redirect_uri', this.redirect_uri);
  
//       const { access_token, expires_in, refresh_token } = <
//         {
//           access_token: string;
//           expires_in: number;
//           refresh_token: string;
//           [key: string]: any;
//         }
//       >(
//         await this.fetch(
//           path,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             data,
//           },
//           'linkedin:authenticate'
//         )
//       ).data;
  
//       // https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2?context=linkedin%2Fconsumer%2Fcontext#api-request-to-retreive-member-details
  
//       const { sub: id } = (
//         await this.fetch(
//           'https://api.linkedin.com/v2/userinfo',
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${access_token}`,
//             },
//           },
//           this.identifier
//         )
//       ).data;
  
//       return {
//         id, //https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns#urns
//         accessToken: access_token,
//         expiresIn: String(expires_in * 1000),
//         refreshToken: refresh_token,
//       };
//       //@todo while fetching this accesstoken from database do check it is expired, only fetch if it is not expired
//       //logic -> save expireIn  =  expires_in + date.now()
//       //if expireIn > date.now() then accessToken is expired
//       //use Authorization: `Bearer ${accessToken}` in headers to post
//     }
  
//     //   https://learn.microsoft.com/en-us/linkedin/media/static-refresh-tokens.png
//     // each new accessToken decreases the ttl of refresh token and user need to auth posteve app once a year.
//     //@todo add this function in socila provider
//     async renewAccessToken(refreshToken: string) {
//       const path = 'https://www.linkedin.com/oauth/v2/accessToken';
  
//       const params = new URLSearchParams();
//       params.append('grant_type', 'refresh_token');
//       params.append('refresh_token', refreshToken);
//       params.append('client_id', this.key);
//       params.append('client_secret', this.secret);
  
//       const p = encodeURI(
//         `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${this.key}&client_secret=${this.secret}`
//       );
  
//       //this gurantees a successfull response -> one trycath at controller level will be enough to catch what
//       //@todo apply this.fetch in twitter.provider.ts
//       const {
//         access_token: accessToken,
//         expires_in: expiresIn,
//         refresh_token: newRefreshToken,
//       } = <
//         {
//           access_token: string;
//           expires_in: number;
//           refresh_token: string;
//           [key: string]: any;
//         }
//       >(
//         await this.fetch(
//           path,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             //if params.tostring() fails use p as data
//             data: params.toString(),
//           },
//           this.identifier
//         )
//       ).data;
//       const { sub: id } = <{ sub: string }>(
//         await this.fetch(
//           'https://api.linkedin.com/v2/userinfo',
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           },
//           this.identifier
//         )
//       ).data;
  
//       return {
//         id, //store in internalId in db
//         accessToken,
//         expiresIn: String(expiresIn * 1000), //linkedin returns in seconds , convert into miliseconds
//         refreshToken: newRefreshToken,
//       };
//     }
  
//     async registerAssets(
//       id: string,
//       accessToken: string,
//       type: 'image' | 'video'
//     ) {
//       const path = 'https://api.linkedin.com/v2/assets?action=registerUpload';
//       const data = {
//         registerUploadRequest: {
//           recipes: [`urn:li:digitalmediaRecipe:feedshare-${type}`],
//           owner: `urn:li:person:${id}`,
//           serviceRelationships: [
//             {
//               relationshipType: 'OWNER',
//               identifier: 'urn:li:userGeneratedContent',
//             },
//           ],
//         },
//       };
  
//       const {
//         value: {
//           uploadMechanism: {
//             'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
//               uploadUrl,
//             },
//           },
//           asset,
//         },
//       } = (
//         await this.fetch(
//           path,
//           {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               'X-Restli-Protocol-Version': '2.0.0',
//             },
//             data,
//           },
//           'linkedin:registerAssets'
//         )
//       ).data;
  
//       return { uploadUrl, asset };
//     }
  
//     async post(accessToken: string, post: PostDetails, urn: string) {
//       //get asset and uploadUrl
//       let assetUrns: string[] = [];
//       if (post.media && post.media?.length > 0) {
  
//         //write logic to upload more than one media
//         post.media.forEach((m)=>{
  
//         })
//         const { asset, uploadUrl } = await this.registerAssets(
//           urn,
//           accessToken,
//           post.media?.type
//         );
//         assetUrns.push(asset as string);
  
//         const assetBuffer = (
//           await this.fetch(
//             'https://res.cloudinary.com/dglr3zicv/image/upload/v1723882882/fioj93zou3ij0xwciylq.jpg',
//             // post.media.url,
//             {
//               method: 'GET', //https://www.youtube.com/watch?v=br8VB99qPzE  buffer vs steream
//               responseType: 'arraybuffer',
//             },
//             'linkedin:post:fetch-asset-from-cloudinary'
//           )
//         ).data;
  
//         const {} = this.fetchFromCloudinary(post.media)
  
//         const contentType = 
//         // (fetch array buffer from cloudinary url)
//         const lires = await this.fetch(
//           uploadUrl,
//           {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               Accept: 'application/octet-stream', //upload binary data
//               // 'Content-Type': 'image/jpg', //@todo set type accordingly
//               'Content-Type': `${(():string=>{return ''})()}`, //@todo set type accordingly
//               'X-Restli-Protocol-Version': '2.0.0',
//             },
//             data: assetBuffer,
//           },
//           'linkedin:post:upload-binary-linkedin'
//         );
//         // console.log(lires, ':::::lires');
//       }
      
//       //step3. create media share. identify your media as asset urn
//       const data: any = {
//         author: `urn:li:person:${urn}`,
//         lifecycleState: 'PUBLISHED',
//         specificContent: {
//           'com.linkedin.ugc.ShareContent': {
//             shareCommentary: {
//               text: post.text, //content
//             },
//             shareMediaCategory: !post.media
//             ? 'NONE'
//             /**todo here media can be of any mimetype jpg, png, mp4,... */
//             : (post.media.type.toUpperCase() as 'VIDEO' | 'IMAGE'),
//             ...(post.media
//               ? {
//                   media: [
//                     {
//                       status: 'READY',
//                       media: assetUrns[0],
//                     },
//                   ],
//                 }
//               : {}),
//           },
//         },
//         visibility: {
//           'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
//         },
//       };
  
//       console.log(data, ':::::::::::::data ');
//       console.log(JSON.stringify(data, null, 2), ':::::::::stringigy data');
//       console.log(assetUrns, ':::::::::::::assetsUrns');
  
//       const res = await this.fetch(
//         'https://api.linkedin.com/v2/ugcPosts',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'X-Restli-Protocol-Version': '2.0.0',
//           },
//           data,
//         },
//         'linkedin:post:ugcPosts-final-post-method'
//       );
//       return res.data;
//     }
//   }
  
//   // in code axios error cost me interface issues as i have to define it in interface that it can have axios errors which makes it pretty ugly
//   //also if this provider shows some error doesn't mean every provider will give same error
//   //so don't use trycatch to catch error -> error will be catched at controller level.
//   //instead use this.fetch which gurantees the result and throws error if not data available
  
//   //don't do unnecessary checks here in providers code  as these checks can be done in controller level.
  
//   interface a {
//     fun: (a: string, b: string) => Promise<any>;
//   }
//   class A implements a {
//     // async fun(a: string) {}
//     async fun(a: string, b: string) {}
//     // async fun(a: string, b: string, c: string) {}
//   }
  
//   const sampleLinkedinErrors = [
//     {
//       //invalid code or expired code
//       err: {
//         data: {
//           error: 'invalid_redirect_uri',
//           error_description:
//             'Unable to retrieve access token: appid/redirect uri/code verifier does not match authorization code. Or authorization code expired. Or external member binding exists',
//         },
//         status: 400,
//         msg: 'Bad Request',
//         identifier: 'linkedin:authenticate',
//       },
//     },
//   ];
  
//   // const redirect_uri = 'http://120.0.0.1:2020/callback/linkedin';
//   //dumb ass 127.0.0.1 not 120.0.0.1 mf
  