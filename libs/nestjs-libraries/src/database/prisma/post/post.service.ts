import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDetails } from '@posteve/nestjs-libraries/social-media/platform.interface';

@Injectable()
export class PostService {
  constructor(private _post: PostRepository) {}

  createPost(params: { userId: string; dto: PostDetails; platformId: string }) {
    const { userId, dto, platformId } = params;
    return this._post.createPost(userId, dto, platformId);
  }
}
