// bc class banana hai
// sidha folder banake class banane lag jata hai soch to ki banan kyu hai
//class hi bana padega
//controller me hi use krega isko aur uske ke liye class chahiye agr function banayega to nestjs use krne ka point hi nhi
// platform manager ko injection container me dalna hoga taki nestjs isko use kr ske

import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TwitterProvider } from './twitter.provider';
import { LinkedinProvider } from './linkedin.provider';
import { SocialProvider } from './platform.interface';

const socialProviders = [new TwitterProvider(), new LinkedinProvider()];

@Injectable({})
export class PlatformManager {
  getPlatformList() {
    return socialProviders.map((p) => p.identifier);
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
    console.log('validatePlatformPipe...', { identifier, metadata });
    if (!platformList.includes(identifier)) {
      throw new NotFoundException(`does not support platform: ${identifier}`);
    }

    return identifier;
  }
}
