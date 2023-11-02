/* eslint-disable */
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from 'src/dtos/CreateMovieDto';
import { ApiResponse } from 'src/payload/ApiResponse';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('/api/v1/movie')
export class MovieController {
  constructor(public movieService: MovieService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  async createMovie(
    @UploadedFiles()
    files: { image: Express.Multer.File[]; video: Express.Multer.File[] },
    @Body() dto: CreateMovieDto,
    @GetUser() user: User,
  ): Promise<ApiResponse> {
    return this.movieService.createMovie(files.image[0], files.video[0], dto, user.email);
  }
}
