import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TwitterProvider } from './twitter.provider';
import { LinkedinProvider } from './linkedin.provider';
import { SocialProvider } from './platform.interface';
import { PlatformLists } from '@posteve/utils/types';

const socialProviders: SocialProvider[] = [
  new TwitterProvider(),
  new LinkedinProvider(),
];

@Injectable({})
export class PlatformManager {
  getPlatformList(): PlatformLists {
    /**
     * @todo
     * return {
     * title, identifier, logoUrl,
     * }
     */
    return socialProviders.map((p) => ({
      identifier: p.identifier,
      title: p.title,
      logoURL: p.logoURL,
    }));
  }

  getPlatformInstance(identifier: string): SocialProvider {
    return socialProviders.find((p) => p.identifier === identifier)!;
  }

  // getIntegratedPlatformList(params: { userId: string; identifier: string }) {
  //   return this.  ye sirf platform manager hai don't manage weather user is connected or not
  // }
}

@Injectable({})
export class validatePlatformPipe implements PipeTransform {
  constructor(private _platform: PlatformManager) {}

  transform(identifier: string, metadata: ArgumentMetadata) {
    const platformList = this._platform.getPlatformList();
    // console.log(platformList.includes(identifier));
    // console.log('validatePlatformPipe...', { identifier, metadata });
    if (!platformList.find((p) => p.identifier === identifier)) {
      throw new NotFoundException(`does not support platform: ${identifier}`);
    }

    return identifier;
  }
}
