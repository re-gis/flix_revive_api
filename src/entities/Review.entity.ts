/* eslint-disable */

import { Column, Entity, NumericType, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  movie: number;

  @Column()
  comment: string;

  @Column()
  rating: number;
}
