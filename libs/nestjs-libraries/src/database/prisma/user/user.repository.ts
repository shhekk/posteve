import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';
import { AuthHelper } from '@posteve/nestjs-libraries/helper/auth/auth.helper';

@Injectable()
export class UserRepository {
  constructor(private _prismaService: PrismaService) {}

  getIntegratedPlatfroms(userId: string) {
    return this._prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        platform: {
          select: {
            id: true,
            identifier: true,
          },
        },
      },
    });
  }

  async activate(id: string) {
    return await this._prismaService.user.update({
      where: { id },
      data: { verified: true },
      select: { id: true, verified: true },
    });
  }

  async getUserDetails(field: string) {
    return await this._prismaService.user.findFirst({
      where: {
        OR: [{ id: field }, { email: field }],
        verified: true,
      },
    });
  }

  async createOrUpdateUser(dto: CreateUserDto) {
    const { email, username, password } = dto;
    return this._prismaService.user.upsert({
      create: {
        username,
        email,
        password: AuthHelper.hashPassword(password),
      },
      where: {
        email,
        verified: false,
      },
      update: {
        username,
        password: AuthHelper.hashPassword(password),
        createdAt: new Date(),
      },
      select: {
        id: true,
        verified: true,
      },
    });
  }

  async findUser(id: string) {
    return this._prismaService.user.findUnique({
      where: {
        id,
        verified: false,
      },
      select: {
        id: true,
        verified: true,
      },
    });
  }

  findVerifiedUser(email: string) {
    return this._prismaService.user.findFirst({
      where: {
        email,
        verified: true,
      },
      select: {
        id: true,
        verified: true,
      },
    });
  }

  async findUserById(id: string) {
    return this._prismaService.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this._prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }
}
