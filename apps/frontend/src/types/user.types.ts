import { UserRole } from './enums';

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth?: Date;
  role?: UserRole;
  position?: string;
  yearsOfExperience?: number;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  status?: boolean;
  position?: string;
  yearsOfExperience?: number;
}
