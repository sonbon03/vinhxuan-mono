import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatSessionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED', // Transferred to human agent
}

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ChatSessionStatus,
    default: ChatSessionStatus.ACTIVE,
  })
  status: ChatSessionStatus;

  @Column({ type: 'timestamp', nullable: true })
  escalatedAt: Date;

  @OneToMany(() => ChatMessage, (message) => message.session)
  messages: ChatMessage[];

  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;
}
