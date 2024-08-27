import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { Log } from './Log';

@ObjectType()
@Entity()
export class SavedQuery extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    _id: number;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    url: string;

    @Field()
    @Column({ type: 'varchar', length: 30 })
    name: string;

    @ManyToOne(() => User, user => user.queries)
    user: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column()
    frequency: number;

    @OneToMany(() => Log, log => log.query)
    logs: Log[];
}
