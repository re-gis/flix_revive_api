/* eslint-disable */

import { Column, Entity, NumericType, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  desc: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  language: string;

  @Column({ nullable: false })
  video: string;

  @Column('varchar', { array: true, nullable: true })
  reviews: Review[];

  @Column({ nullable: true })
  rate: number;

  constructor(
    name: string,
    desc: string,
    image: string,
    category: string,
    language: string,
    video: string,
    reviews: Review[],
    rate?: number,
  ) {
    this.name = name;
    this.category = category;
    this.desc = desc;
    this.image = image;
    this.video = video;
    this.language = language;
    this.rate = rate;
    this.reviews = reviews;
  }
}
