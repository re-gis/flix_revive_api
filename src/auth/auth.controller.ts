/* eslint-disable */
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/RegisterDto';
import { ApiResponse } from 'src/payload/ApiResponse';
import { UserService } from 'src/user/user.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto): Promise<ApiResponse> {
    return this.userService.registerUser(dto);
  }
}
