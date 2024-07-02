import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from 'typeorm';
import { Query } from './Query';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 20 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    password: string;

    @Column({ type: 'enum', enum: [0, 1, 2] })
    role: number;

    @OneToMany(() => Query, query => query.user)
    queries: Query[];
}
