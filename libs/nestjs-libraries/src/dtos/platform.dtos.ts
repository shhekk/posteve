import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConnectPlatformDTO {
  @IsDefined()
  @IsString()
  verifier!: string; // code/pin after user authorize the platform

  @IsDefined()
  @IsString()
  token!: string;
}

