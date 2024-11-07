import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { SavedQuery } from "./SavedQuery";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  _id: number;

  @Field()
  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.group)
  @JoinTable()
  users: User[];

  @OneToMany(() => SavedQuery, (query) => query.group)
  queries?: SavedQuery[];
}
