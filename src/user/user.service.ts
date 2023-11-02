/* eslint-disable */
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dtos/LoginDto';
import { RegisterDto } from 'src/dtos/RegisterDto';
import { User } from 'src/entities/user.entity';
import { CustomException } from 'src/exceptions/CustomException';
import { ApiResponse } from 'src/payload/ApiResponse';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { deleteAccntDto } from 'src/dtos/DeleteAccntDto';

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

  async loginUser(dto: LoginDto): Promise<ApiResponse> {
    try {
      let { email, password } = dto;

      if (!email || !password) {
        return new ApiResponse(false, 'All credentials are required!');
      }

      const eUser = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!eUser || !(await bcrypt.compare(password, eUser.password))) {
        return new ApiResponse(false, 'Invalid email or password!');
      }

      const token = await this.utilsService.generateToken(eUser);
      return new ApiResponse(true, 'User logged in successfully!', token);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(email: string, attrs: Partial<User>): Promise<ApiResponse> {
    try {
      if (Object.keys(attrs).length === 0) {
        return new ApiResponse(false, 'Nothing to update given!');
      }
      const eUser = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!eUser) {
        return new ApiResponse(false, 'No user found!');
      }

      Object.assign(eUser, attrs);
      // generate a token for an updated user
      await this.userRepository.save(eUser);
      const token = await this.utilsService.generateToken(eUser);
      return new ApiResponse(true, 'User updated successfully...', token);
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAccnt(email: string, dto: deleteAccntDto): Promise<ApiResponse> {
    try {
      // get logged in user
      const eUser = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!eUser) {
        return new ApiResponse(false, 'User not found!');
      }

      // get password
      if (!dto.password) {
        return new ApiResponse(false, 'Password required to delete account!');
      }

      if (!(await bcrypt.compare(dto.password, eUser.password))) {
        return new ApiResponse(false, 'Invalid password!');
      }

      await this.userRepository.remove(eUser);
      return new ApiResponse(true, 'User account deleted successfully!');
    } catch (e) {
      throw new CustomException(
        'Internal server error...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
