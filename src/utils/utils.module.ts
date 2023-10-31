import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtService } from '@nestjs/jwt/dist';

@Module({
  providers: [UtilsService, JwtService],
})
export class UtilsModule {}
