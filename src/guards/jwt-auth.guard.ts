/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { CustomException } from 'src/exceptions/CustomException';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer ')) {
      let token = authorization.split(' ')[1];
      if (!token)
        throw new CustomException(
          'You are not authorised to perform this action',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      try {
        const decoded = verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return true;
      } catch (e) {
        throw new CustomException(
          'Error while getting the token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    throw new CustomException(
      'You are not authorised to perform this action please',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
