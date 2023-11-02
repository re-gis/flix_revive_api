/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateMovieDto } from 'src/dtos/CreateMovieDto';
import { Movie } from 'src/entities/movie.entity';
import { User } from 'src/entities/user.entity';
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
  ) {}

  async createMovie(
    imagePath: Express.Multer.File,
    videoPath: Express.Multer.File,
    dto: CreateMovieDto,
    email: string,
  ): Promise<ApiResponse> {
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
    console.log(email)
    if (!eUser) {
      return new ApiResponse(false, 'No user found!');
    }

    if(eUser.isAdmin == false){
        return new ApiResponse(false, "You are not allowed to perform this action!")
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

    if (!image ) {
      return new ApiResponse(false, 'Error while uploading image or video!');
    }
    // save movie
    const movie = this.movieRepository.create({
      category: category,
      desc: desc,
      name: name,
      language: language,
      image: image.url,
      video: "video.url",
    });

    if (!(await this.movieRepository.save(movie))) {
      return new ApiResponse(false, 'Error while saving the movie!');
    }
    return new ApiResponse(true, 'Movie saved successfully!', movie);
  }

  //   async getMovies
}
