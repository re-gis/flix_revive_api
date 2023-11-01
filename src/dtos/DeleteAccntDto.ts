/* eslint-disable */
import { IsNotEmpty } from 'class-validator';

export class deleteAccntDto {
  @IsNotEmpty()
  password: string;
}
