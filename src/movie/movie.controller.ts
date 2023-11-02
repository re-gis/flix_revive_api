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
  @UseGuards(IsAdminGuard)
  async createMovie(
    @UploadedFiles()
    files: { image: Express.Multer.File[]; video: Express.Multer.File[] },
    @Body() dto: CreateMovieDto,
  ): Promise<ApiResponse> {
    return this.movieService.createMovie(files.image[0], files.video[0], dto);
  }
}
