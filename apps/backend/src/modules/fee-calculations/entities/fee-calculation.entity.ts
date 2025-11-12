import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DocumentGroup } from '../../document-groups/entities/document-group.entity';
import { FeeType } from '../../fee-types/entities/fee-type.entity';

export interface CalculationDetail {
  baseFee?: number;
  percentageFee?: number;
  tieredFees?: {
    tier: number;
    from: number;
    to: number | null;
    rate: number;
    amount: number;
    description: string;
  }[];
  additionalFees?: {
    name: string;
    amount: number;
    quantity?: number;
    total: number;
    description: string;
  }[];
  subtotal: number;
  totalFee: number;
}

@Entity('fee_calculations')
export class FeeCalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string; // Nullable for guest users

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  documentGroupId: string;

  @ManyToOne(() => DocumentGroup, { eager: true })
  @JoinColumn({ name: 'documentGroupId' })
  documentGroup: DocumentGroup;

  @Column({ type: 'uuid' })
  feeTypeId: string;

  @ManyToOne(() => FeeType, { eager: true })
  @JoinColumn({ name: 'feeTypeId' })
  feeType: FeeType;

  @Column({ type: 'jsonb' })
  inputData: Record<string, any>; // User's input values

  @Column({ type: 'jsonb' })
  calculationResult: CalculationDetail; // Detailed breakdown

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalFee: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
