import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { UtilsService } from 'src/utils/utils.service';
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UtilsModule,
    JwtModule,
    MailerModule,
  ],
  controllers: [UserController],
  providers: [UserService, UtilsService, MailerService],
})
export class UserModule {}
