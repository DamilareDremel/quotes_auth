// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Quote } from "./Quote";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

   @Column()
  username: string;  // ✅ this is the key part

  @Column()
  password: string;

  @OneToMany(() => Quote, quote => quote.user)
quotes: Quote[];

}
