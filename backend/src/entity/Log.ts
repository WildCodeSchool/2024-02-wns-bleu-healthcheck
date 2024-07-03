import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BaseEntity} from 'typeorm';
import { Query } from './Query';

@Entity()
export class Log extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @ManyToOne(() => Query, query => query.logs)
    query: Query;

    @CreateDateColumn()
    date: Date;

    @Column({ type: 'enum', enum: [0, 1, 2] })
    status: number; // 0: Error (red), 1: Warning (orange), 2: Success (green)

    @Column({ type: 'int' })
    response_time: number;

    @Column({ type: 'int' })
    status_code: number;

    @Column({ type: 'varchar', length: 255 })
    status_message: string;
}
