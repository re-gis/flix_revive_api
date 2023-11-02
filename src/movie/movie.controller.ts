/* eslint-disable */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Movie } from 'src/entities/movie.entity';
import { CreareReviewDto } from 'src/dtos/CreareReviewDto';

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
    return this.movieService.createMovie(
      files.image[0],
      files.video[0],
      dto,
      user.email,
    );
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllMovies(@GetUser() user: User): Promise<ApiResponse> {
    return this.movieService.getAllMovies(user.email);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneMovie(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<ApiResponse> {
    return this.movieService.getOneMovies(id, user.email);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  async updateMovie(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() attrs: Partial<Movie>,
  ): Promise<ApiResponse> {
    return this.movieService.updateMovie(id, user.email, attrs);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMovie(
    @GetUser() u: User,
    @Param('id') id: number,
  ): Promise<ApiResponse> {
    return this.movieService.deleteMovie(id, u.email);
  }

  @Patch('/review/:id')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: CreareReviewDto,
  ): Promise<ApiResponse> {
    return this.movieService.createReview(
      dto.rating,
      user.email,
      dto.comment,
      id,
    );
  }
}
