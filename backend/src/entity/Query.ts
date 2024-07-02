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
import { User } from './User';
import { Log } from './Log';

@Entity()
export class Query extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ type: 'varchar', length: 100 })
    url: string;

    @Column({ type: 'varchar', length: 30 })
    name: string;

    @ManyToOne(() => User, user => user.queries)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @Column({ type: 'interval' })
    frequency: string;

    @OneToMany(() => Log, log => log.query)
    logs: Log[];
}
