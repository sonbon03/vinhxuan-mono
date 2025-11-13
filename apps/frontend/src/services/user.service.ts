import api from './api';
import { CreateUserDto, UpdateUserDto, UserRole } from '@/types';
import type { PaginatedData } from '../types/api.types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  role: UserRole;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const userService = {
  /**
   * Get all users with pagination, search, and filters
   */
  getUsers: async (params: QueryUsersParams): Promise<PaginatedData<User>> => {
    const response = await api.get<PaginatedData<User>>('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  /**
   * Activate user account
   */
  activateUser: async (id: string): Promise<User> => {
    const response = await api.post<User>(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate user account
   */
  deactivateUser: async (id: string): Promise<User> => {
    const response = await api.post<User>(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Update user status
   */
  updateUserStatus: async (id: string, status: boolean): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update user password
   */
  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.patch('/auth/change-password', data);
  },
};
