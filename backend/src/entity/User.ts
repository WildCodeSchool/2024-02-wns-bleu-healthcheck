import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { SavedQuery } from './SavedQuery';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    _id: number;

    @Field()
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Field()
    @Column({ type: 'varchar', length: 20 })
    name: string;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Field(() => Int)
    @Column({ type: 'enum', enum: [0, 1, 2] })
    role: number;

    @OneToMany(() => SavedQuery, query => query.user)
    queries: SavedQuery[];
}
