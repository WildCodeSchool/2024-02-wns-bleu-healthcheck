import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BaseEntity, Index} from 'typeorm';
import { SavedQuery } from './SavedQuery';
import {ObjectType, Field, Int} from "type-graphql";

@ObjectType()
@Entity()
@Index(["query", "date"])
export class Log extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    _id: number;

    @ManyToOne(() => SavedQuery, query => query.logs)
    query: SavedQuery;

    @Field()
    @CreateDateColumn()
    date: Date;

    @Field()
    @Column({ type: 'enum', enum: [0, 1, 2] })
    status: number; // 0: Error (red), 1: Warning (orange), 2: Success (green)

    @Field()
    @Column({ type: 'int' })
    response_time: number;

    @Field()
    @Column({ type: 'int' })
    status_code: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    status_message: string;
}
