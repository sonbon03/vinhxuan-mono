import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentGroup } from '../../document-groups/entities/document-group.entity';

export enum CalculationMethod {
  FIXED = 'FIXED',             // Phí cố định
  PERCENT = 'PERCENT',         // Phí theo % giá trị
  VALUE_BASED = 'VALUE_BASED', // Phí theo khoảng giá trị
  TIERED = 'TIERED',           // Phí theo bậc thang
  FORMULA = 'FORMULA',         // Công thức tùy chỉnh
}

export interface TieredPricingTier {
  from: number;
  to: number | null; // null means infinity
  rate: number; // Percentage rate or fixed amount
  description?: string;
}

export interface AdditionalFee {
  name: string;
  amount: number;
  perUnit: boolean; // If true, multiply by quantity
  description?: string;
}

export interface FormulaSchema {
  method: CalculationMethod;
  tiers?: TieredPricingTier[]; // For TIERED method
  additionalFees?: AdditionalFee[]; // Extra fees like copy fees
  customFormula?: string; // For FORMULA method (JavaScript expression)
}

@Entity('fee_types')
export class FeeType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  documentGroupId: string;

  @ManyToOne(() => DocumentGroup, { eager: true })
  @JoinColumn({ name: 'documentGroupId' })
  documentGroup: DocumentGroup;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CalculationMethod,
    default: CalculationMethod.FIXED,
  })
  calculationMethod: CalculationMethod;

  @Column({ type: 'jsonb', nullable: true })
  formula: FormulaSchema;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  baseFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  percentage: number; // e.g., 0.015 for 1.5%

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxFee: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
