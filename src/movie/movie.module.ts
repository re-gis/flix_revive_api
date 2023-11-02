/* eslint-disable */
import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[TypeOrmModule.forFeature([Movie, User]), UserModule, UtilsModule, JwtModule, CloudinaryModule],
  controllers: [MovieController],
  providers: [MovieService, UserService, UtilsService, CloudinaryService]
})
export class MovieModule {}
