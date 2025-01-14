import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository';
import { CreateUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';

@Injectable({})
export class UserService {
  constructor(private _userRepository: UserRepository) {}

  getUserPlatfroms({ userId }: { userId: string }) {
    return this._userRepository.getIntegratedPlatfroms(userId);
  }

  /**get all details of user -- used in authMiddleware*/
  async getUserDetails(emailOrId: string) {
    return this._userRepository.getUserDetails(emailOrId);
  }

  createOrUpdateUser(dto: CreateUserDto) {
    return this._userRepository.createOrUpdateUser(dto);
  }

  async findUser(id: string) {
    return this._userRepository.findUser(id);
  }

  findVerifiedUser(p: { email: string }) {
    return this._userRepository.findVerifiedUser(p.email);
  }

  async activate(id: string) {
    return this._userRepository.activate(id);
  }
}
