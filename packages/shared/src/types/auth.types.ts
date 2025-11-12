import { UserRole } from './user.types';

/**
 * Login DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Register DTO
 */
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
}

/**
 * Auth Response
 */
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

/**
 * Refresh Token DTO
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
