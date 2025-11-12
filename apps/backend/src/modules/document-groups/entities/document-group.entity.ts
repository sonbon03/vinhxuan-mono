import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  min?: number; // For number fields
  max?: number; // For number fields
  defaultValue?: any;
}

export interface FormFieldsSchema {
  fields: FormField[];
}

@Entity('document_groups')
export class DocumentGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  formFields: FormFieldsSchema;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
