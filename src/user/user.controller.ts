/* eslint-disable */
import { Controller, Patch, UseGuards, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { ApiResponse } from 'src/payload/ApiResponse';
import { deleteAccntDto } from 'src/dtos/DeleteAccntDto';

@Controller('/api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: User,
    @Body() attrs: Partial<User>,
  ): Promise<ApiResponse> {
    return this.userService.updateUser(user.email, attrs);
  }

  @Delete('/delete-account')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @GetUser() user: User,
    @Body() dto: deleteAccntDto,
  ): Promise<ApiResponse> {
    return this.userService.deleteAccnt(user.email, dto);
  }
}
