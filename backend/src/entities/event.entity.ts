import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { EventParticipant } from './event-participant.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.createdEvents)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @ManyToOne(() => Category, (category) => category.events)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];
}

