import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Service } from '../../services/entities/service.entity';

export enum ConsultationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column({ type: 'uuid', nullable: true })
  staffId: string;

  @ManyToOne(() => Employee, { eager: true, nullable: true })
  @JoinColumn({ name: 'staffId' })
  staff: Employee;

  @Column({ type: 'uuid', nullable: true })
  serviceId: string;

  @ManyToOne(() => Service, { eager: true, nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ type: 'timestamp' })
  requestedDatetime: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.PENDING,
  })
  status: ConsultationStatus;

  @Column({ type: 'text', nullable: true })
  cancelReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
