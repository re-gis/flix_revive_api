/* eslint-disable */
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dtos/RegisterDto';
import { User } from 'src/entities/user.entity';
import { CustomException } from 'src/exceptions/CustomException';
import { ApiResponse } from 'src/payload/ApiResponse';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    private utilsService: UtilsService,
  ) {}

  async registerUser(dto: RegisterDto): Promise<ApiResponse> {
    let { fullname, email, password, isAdmin } = dto;

    if (!fullname || !email || !password) {
      return new ApiResponse(false, 'All credentials are required');
    } else {
      const eUser = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });

      if (eUser) {
        return new ApiResponse(false, `Email ${email} already exists!`);
      } else {
        if (!isAdmin) {
          isAdmin = false;
        }
        const uToCreate = new User(fullname, email, password, isAdmin);
        uToCreate.password = await this.utilsService.hashPassword(password);
        try {
          const userEntity = await this.userRepository.create(uToCreate);
          const createdUser = await this.userRepository.save({
            ...userEntity,
          });

          return new ApiResponse(
            true,
            'User registered successfully, Login to continue',
          );
        } catch (e) {
          console.log(e);
          throw new CustomException(
            'Error while saving the user...',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }
}
