/* eslint-disable */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.isAdmin) {
      return true;
    } else {
      return false;
    }
  },
);
