// src/entities/Quote.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Quote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  text: string;

  @Column()
  author: string;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => User)
@JoinColumn({ name: "userId" })
user: User;

@Column({ nullable: true })
userId: string;

}
