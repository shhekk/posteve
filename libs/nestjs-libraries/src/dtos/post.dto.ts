import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Media, PostDetails } from '../social-media/platform.interface';
import { Type } from 'class-transformer';

export class MediaDTO implements Media {
  @IsString()
  @IsDefined()
  @IsIn(['IMAGE', 'VIDEO'])
  type!: 'IMAGE' | 'VIDEO';

  @IsString()
  @IsDefined()
  url!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
export class CreatePostDTO implements PostDetails {
  @IsString()
  @IsDefined()
  text!: string;

  @IsArray()
  @IsOptional()
  @Type(() => MediaDTO)
  media?: MediaDTO[];
}
