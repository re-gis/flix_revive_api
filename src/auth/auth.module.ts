/* eslint-disable */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilsModule, JwtModule, MailerModule],
  controllers: [AuthController],
  providers: [UserService, UtilsService, MailerService],
})
export class AuthModule {}
