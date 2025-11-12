/**
 * User Role Enum
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

/**
 * User Status
 */
export type UserStatus = boolean; // true = Active, false = Inactive

/**
 * User Interface
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create User DTO
 */
export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
  role?: UserRole;
  // Employee fields (only used when role is ADMIN or STAFF)
  position?: string;
  yearsOfExperience?: number;
}

/**
 * Update User DTO
 */
export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  status?: UserStatus;
  // Employee fields (only used when role is ADMIN or STAFF)
  position?: string;
  yearsOfExperience?: number;
}

/**
 * User Query DTO
 */
export interface UserQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: 'createdAt' | 'fullName' | 'email';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Employee Interface
 */
export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  status: string; // 'WORKING' | 'ON_LEAVE' | 'RESIGNED'
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Employee DTO
 */
export interface CreateEmployeeDto {
  userId?: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  dateOfBirth?: Date | string;
  status?: string;
}

/**
 * Update Employee DTO
 */
export interface UpdateEmployeeDto {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  yearsOfExperience?: number;
  status?: string;
}
