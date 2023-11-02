/* eslint-disable */

import { IsNotEmpty, IsString } from 'class-validator';

export class CreareReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  rating: number;
}
