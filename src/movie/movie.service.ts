/* eslint-disable */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateMovieDto } from 'src/dtos/CreateMovieDto';
import { Review } from 'src/entities/Review.entity';
import { Movie } from 'src/entities/movie.entity';
import { User } from 'src/entities/user.entity';
import { CustomException } from 'src/exceptions/CustomException';
import { ApiResponse } from 'src/payload/ApiResponse';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    private userService: UserService,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  async createMovie(
    imagePath: Express.Multer.File,
    videoPath: Express.Multer.File,
    dto: CreateMovieDto,
    email: string,
  ): Promise<ApiResponse> {
    try {
      if (
        !dto.name ||
        !dto.desc ||
        !dto.category ||
        !dto.language ||
        !imagePath ||
        !videoPath
      ) {
        return new ApiResponse(false, 'All movie details are required!');
      }
      let { name, desc, category, language } = dto;

      // get logged in user
      const eUser = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!eUser) {
        return new ApiResponse(false, 'No user found!');
      }

      if (eUser.isAdmin == false) {
        return new ApiResponse(
          false,
          'You are not allowed to perform this action!',
        );
      }

      const eMovie = await this.movieRepository.findOne({
        where: { name: name },
      });

      if (eMovie) {
        return new ApiResponse(false, `Movie already exists!`);
      }
      // upload image && video
      const image = await this.cloudinaryService.uploadImage(imagePath);
      // const video = await this.cloudinaryService.uploadVideo(videoPath);

      if (!image) {
        return new ApiResponse(false, 'Error while uploading image or video!');
      }
      // save movie
      const movie = this.movieRepository.create({
        category: category,
        desc: desc,
        name: name,
        language: language,
        image: image.url,
        video: 'video.url',
      });

      if (!(await this.movieRepository.save(movie))) {
        return new ApiResponse(false, 'Error while saving the movie!');
      }
      return new ApiResponse(true, 'Movie saved successfully!', movie);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMovies(email): Promise<ApiResponse> {
    try {
      // first login
      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        return new ApiResponse(false, 'User not found!');
      }

      // get movies
      const movies = await this.movieRepository.find();
      if (movies.length == 0) {
        return new ApiResponse(true, 'No movies found for now!');
      }

      return new ApiResponse(true, 'Movies fetched successfully!', movies);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneMovies(id: number, email: string): Promise<ApiResponse> {
    try {
      // get user
      const user: User = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        return new ApiResponse(false, 'User not found!');
      }

      // get one movies
      const movie = await this.movieRepository.findOneBy({ id });
      if (!movie) {
        return new ApiResponse(false, `Movie ${id} not found!`);
      }

      return new ApiResponse(true, 'Movie fetched successfully!', movie);
    } catch (e) {
      console.log(e);
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMovie(
    id: number,
    email: string,
    attrs: Partial<Movie>,
  ): Promise<ApiResponse> {
    try {
      const eU: User = await this.userRepository.findOne({ where: { email } });
      if (!eU) {
        return new ApiResponse(false, 'User not found!');
      }

      if (eU.isAdmin == false) {
        return new ApiResponse(
          false,
          'You are not authorised to perform this action...',
        );
      }

      const eM: Movie = await this.movieRepository.findOne({ where: { id } });
      if (!eM) {
        return new ApiResponse(false, `Movie ${id} not found!`);
      }

      if (Object.keys(attrs).length == 0) {
        return new ApiResponse(false, 'Nothing to update given!');
      }

      Object.assign(eM, attrs);
      await this.movieRepository.save(eM);
      return new ApiResponse(true, `Movie ${id} updated successfully...`);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMovie(id: number, email: string): Promise<ApiResponse> {
    try {
      const u: User = await this.userRepository.findOne({ where: { email } });
      if (!u) {
        return new ApiResponse(false, 'User not found!');
      }

      const m: Movie = await this.movieRepository.findOne({ where: { id } });
      if (!m) {
        return new ApiResponse(false, `Movie ${id} not found!`);
      }

      if (u.isAdmin == false) {
        return new ApiResponse(
          false,
          'You are not authorised to perform this action!',
        );
      }

      await this.movieRepository.remove(m);
      return new ApiResponse(true, `Movie ${m.name} deleted successfully!`);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createReview(
    rating: number,
    email: string,
    comment: string,
    id: number,
  ): Promise<ApiResponse> {
    try {
      if (!comment || !rating) {
        return new ApiResponse(false, 'All details are required!');
      }
      const user: User = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        return new ApiResponse(false, 'User not found!');
      }

      const movie: Movie = await this.movieRepository.findOne({
        where: { id },
      });
      if (!movie) {
        return new ApiResponse(false, `Movie ${id} not found!`);
      }

      // check if it already reviewed
      if (
        movie.reviews != null &&
        movie.reviews.find((r) => r.user.toString() === user.email.toString())
      ) {
        return new ApiResponse(false, `Movie ${movie.name} already reviewed!`);
      }

      // create review
      const r: Review = await this.reviewRepository.create({
        comment: comment,
        movie: movie.id,
        user: user.email,
        rating: rating,
      });

      await this.reviewRepository.save(r);
      movie.reviews.push(r);
      movie.rate =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;
      await this.movieRepository.save(movie);

      return new ApiResponse(true, 'Movie reviewes successfully!', r);
    } catch (e) {
      console.log(e);
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
