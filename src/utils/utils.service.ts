/* eslint-disable */
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CustomException } from 'src/exceptions/CustomException';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}

  async hashPassword(input): Promise<string> {
    try {
      if (typeof input !== 'string') {
        throw new CustomException(
          'Input type not allowed!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const hash: string = await bcrypt.hash(input, 10);
        return hash;
      }
    } catch (e) {
      throw new CustomException(
        'Error while hashing password!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateToken(user: User): Promise<string> {
    const token: string = await this.jwt.signAsync(
      { email: user.email, username: user.fullname },
      {
        expiresIn: '7d',
        secret: this.configService.get('SECRET_KEY'),
      },
    );

    return token;
  }
}
