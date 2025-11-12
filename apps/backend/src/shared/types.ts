// Shared types for both frontend and backend

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum RecordStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ListingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ConsultationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  sub: string; // JWT standard field for subject (user ID)
  userId: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  role?: UserRole;
  // Employee-specific fields (used when role is ADMIN or STAFF)
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
  // Employee-specific fields (used when role is ADMIN or STAFF)
  position?: string;
  yearsOfExperience?: number;
}
