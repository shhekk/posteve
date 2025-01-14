import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user/user.service';

@Injectable({})
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      
    } catch (error) {
      console.log(`prisma connection error: ${error}`);
    }
  }
}

// @Injectable({})
// export class PrismaRepository<T extends keyof PrismaService> {
//   public model: Pick<PrismaService, T>;
//   constructor(private _prismaService: PrismaService) {
//     this.model = this._prismaService;
//   }
// }
