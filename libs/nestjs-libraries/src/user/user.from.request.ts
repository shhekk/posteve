import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

//@todo read executioncontext again from nestdocs
//@todo revise this yaad hi nhi bc
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log(request.user)
    return request.user;
  }
);
