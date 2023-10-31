/* eslint-disable */
import { InitiatorAudit } from 'src/audit/InitiatorAudit';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity('users')
export class User extends InitiatorAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  image?: string;

  @Column({ default: false })
  isAdmin?: boolean;

  @OneToMany(() => Movie, (movie) => movie.id)
  likedMovies: Movie[];

  constructor(
    fullname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    likedMovies?: Movie[],
    image?: string,
  ) {
    super();
    this.fullname = fullname;
    this.email = email;
    this.image = image;
    this.likedMovies = likedMovies;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}
