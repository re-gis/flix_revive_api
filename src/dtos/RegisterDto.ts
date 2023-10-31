/* eslint-disable */

import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  isAdmin?: boolean;
}
