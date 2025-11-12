import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatSession } from './chat-session.entity';

export enum MessageSender {
  USER = 'USER',
  BOT = 'BOT',
  AGENT = 'AGENT', // Human agent
}

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: ChatSession;

  @Column({
    type: 'enum',
    enum: MessageSender,
  })
  sender: MessageSender;

  @Column({ type: 'text' })
  messageText: string;

  @CreateDateColumn()
  createdAt: Date;
}
