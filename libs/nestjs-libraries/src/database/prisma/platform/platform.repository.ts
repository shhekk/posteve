import { AuthTokenBody } from '@posteve/nestjs-libraries/social-media/platform.interface';
import { PrismaService } from '../prisma.service';

export class PlatformRepository {
  private _prismaRepository = new PrismaService();
  constructor() {}

  getPlatformId(userId: string, identifier: string) {
    return this._prismaRepository.platform.findUnique({
      where: {
        userId_identifier: {
          userId,
          identifier,
        },
      },
      select: {
        id: true,
      },
    });
  }

  createPlatform(
    userId: string,
    identifier: string,
    token: string,
    expiresIn: string,
    urn: string,
    refreshToken?: string
  ) {
    return this._prismaRepository.platform.create({
      data: {
        user: {
          connect: { id: userId },
        },
        identifier,
        token,
        expiresIn,
        urn,
        ...(refreshToken ? { refreshToken } : {}),
      },
      select: {
        id: true,
        identifier: true,
        token: true,
        expiresIn: true,
        user: {
          select: {
            //select means do give this(select what you want from related entity)
            email: true,
            verified: true,
            platform: {
              select: {
                identifier: true,
              },
            },
          },
        },
      },
    });
  }

  //@todo post add field
  createOrUpdatePlatform(
    userId: string,
    identifier: string,
    token: string,
    expiresIn: string,
    urn: string,
    refreshToken = ''
  ) {
    return this._prismaRepository.platform.upsert({
      where: {
        //new unique property
        userId_identifier: {
          userId,
          identifier,
        },
      },
      create: {
        userId,
        identifier,
        token,
        urn,
        expiresIn,
        refreshToken,
      },
      update: {},
    });
  }

  async getTokenBody(userId: string, identifier: string) {
    return this._prismaRepository.platform.findFirst({
      where: { userId, identifier },
      select: {
        token: true,
        expiresIn: true,
        urn: true,
        refreshToken: true,
      },
    });
  }
}
