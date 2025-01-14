import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PostDetails } from '@posteve/nestjs-libraries/social-media/platform.interface';

@Injectable({})
export class PostRepository {
  constructor(private _prismaService: PrismaService) {}

  async createPost(userId: string, dto: PostDetails, platformId: string) {
    const { text, media } = dto;
    return await this._prismaService.post.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        platform: {
          connect: {
            id: platformId,
          },
        },
        content: text,
        ...(media
          ? {
              media: {
                createMany: {
                  data: media.map((m) => {
                    return {
                      type: m.type,
                      url: m.url,
                      title: m.title,
                      description: m.description,
                    };
                  }),
                },
              },
            }
          : {}),
      },
    });
  }
}
