import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EventType {
  BIRTHDAY = 'BIRTHDAY',
  HOLIDAY = 'HOLIDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  OTHER = 'OTHER',
}

@Entity('email_campaigns')
export class EmailCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({ type: 'text' })
  template: string;

  @Column({ type: 'text', nullable: true })
  subject: string;

  @Column({ type: 'jsonb', nullable: true })
  schedule: any; // { type: 'daily' | 'weekly' | 'monthly' | 'once', date?: string, time?: string }

  @Column({ type: 'jsonb', nullable: true })
  recipientCriteria: any; // { roles?: string[], dateOfBirth?: boolean, etc. }

  @Column({ type: 'boolean', default: true })
  status: boolean; // true = active, false = paused

  @Column({ type: 'timestamp', nullable: true })
  lastSentAt: Date;

  @Column({ type: 'int', default: 0 })
  sentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
