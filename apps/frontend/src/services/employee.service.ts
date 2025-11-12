import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum EmployeeStatus {
  WORKING = 'WORKING',
  ON_LEAVE = 'ON_LEAVE',
  RESIGNED = 'RESIGNED',
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  dateOfBirth?: Date;
  status: EmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeDto {
  name: string;
  position: string;
  email: string;
  phone: string;
  yearsOfExperience?: number;
  dateOfBirth?: string;
  status?: EmployeeStatus;
}

export interface UpdateEmployeeDto {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  yearsOfExperience?: number;
  dateOfBirth?: string;
  status?: EmployeeStatus;
}

export interface QueryEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployeeStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const employeeService = {
  /**
   * Get all employees with pagination, search, and filters
   */
  getEmployees: async (params: QueryEmployeesParams): Promise<PaginatedData<Employee>> => {
    const response = await api.get<PaginatedData<Employee>>('/employees', { params });
    return response.data;
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  /**
   * Create new employee
   */
  createEmployee: async (data: CreateEmployeeDto): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  /**
   * Update employee
   */
  updateEmployee: async (id: string, data: UpdateEmployeeDto): Promise<Employee> => {
    const response = await api.patch<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  /**
   * Update employee status
   */
  updateEmployeeStatus: async (id: string, status: EmployeeStatus): Promise<Employee> => {
    const response = await api.patch<Employee>(`/employees/${id}/status/${status}`);
    return response.data;
  },
};
