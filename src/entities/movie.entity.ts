/* eslint-disable */

import { Column, Entity, NumericType, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
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

  @Column()
  rate: number;

  constructor(
    name: string,
    desc: string,
    image: string,
    category: string,
    language: string,
    video: string,
    rate?: number,
  ) {
    this.name = name;
    this.category = category;
    this.desc = desc;
    this.image = image;
    this.video = video;
    this.language = language;
    this.rate = rate;
  }
}
