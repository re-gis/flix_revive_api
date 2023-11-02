/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IsAdmin } from 'src/decorators/is-admin.decorator';
import { CustomException } from 'src/exceptions/CustomException';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const isadmin = IsAdmin(null, context);

    if (!isadmin) {
      throw new CustomException(
        'Access denied. You are not an admin.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
