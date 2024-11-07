import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { Log } from "./Log";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class SavedQuery extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  _id: number;

  @Field()
  @Column({ type: "varchar", length: 100 })
  url: string;

  @Field()
  @Column({ type: "varchar", length: 30 })
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  frequency: number;

  @Field()
  @Column({ default: 1 })
  queryOrder: number;

  @ManyToOne(() => User, (user) => user.queries, { nullable: true })
  user?: User;

  @ManyToOne(() => Group, (group) => group.queries, { nullable: true })
  group?: Group;

  @OneToMany(() => Log, (log) => log.query)
  logs: Log[];
}
