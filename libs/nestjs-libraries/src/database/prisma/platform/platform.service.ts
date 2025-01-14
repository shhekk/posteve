//keep it short and simple just for refrence
//do any edits on Repositories
import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { PrismaService } from '../prisma.service';

@Injectable({})
export class PlatformService {
  constructor(private _platformRepository: PlatformRepository) {}

  getPlatformId(params: { userId: string; identifier: string }) {
    const { userId, identifier } = params;
    return this._platformRepository.getPlatformId(userId, identifier);
  }

  createPlatform(params: {
    userId: string;
    identifier: string;
    token: string;
    expiresIn: string;
    urn: string;
    refreshToken?: string;
  }) {
    const { userId, identifier, token, expiresIn, urn, refreshToken } = params;
    return this._platformRepository.createPlatform(
      userId,
      identifier,
      token,
      expiresIn,
      urn,
      refreshToken
    );
  }

  getTokenBody(userId: string, identifier: string) {
    return this._platformRepository.getTokenBody(userId, identifier);
  }
}
