/* eslint-disable */

import { BeforeInsert, BeforeUpdate, Column, Entity, NumericType, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column('numeric', { nullable: true })
  rate: number;

  @BeforeInsert()
  @BeforeUpdate()
  initializeReviews() {
    if (!this.reviews) {
      this.reviews = [];
    }
  }

  constructor(
    name: string,
    desc: string,
    image: string,
    category: string,
    language: string,
    video: string,
    reviews?: Review[],
    rate?: number,
  ) {
    this.name = name;
    this.category = category;
    this.desc = desc;
    this.image = image;
    this.video = video;
    this.language = language;
    this.rate = rate;
    if (reviews) {
      this.reviews = reviews;
    }
  }
}
