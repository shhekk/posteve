//@todo create a injectable to catch all the prisma errors and send request accordingly

import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaErrorService {
  constructor() {}
}
