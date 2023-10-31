import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilsModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, UtilsService],
})
export class UserModule {}
