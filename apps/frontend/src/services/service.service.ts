import api from './api';
import type { PaginatedData } from '../types/api.types';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryServicesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateServiceData {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: string;
  status?: boolean;
}

export interface UpdateServiceData {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  status?: boolean;
}

export const serviceService = {
  /**
   * Get all services with pagination and filters
   */
  getServices: async (params: QueryServicesParams): Promise<PaginatedData<Service>> => {
    const response = await api.get<PaginatedData<Service>>('/services', { params });
    return response.data;
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  /**
   * Create new service
   */
  createService: async (data: CreateServiceData): Promise<Service> => {
    const response = await api.post<Service>('/services', data);
    return response.data;
  },

  /**
   * Update service
   */
  updateService: async (id: string, data: UpdateServiceData): Promise<Service> => {
    const response = await api.patch<Service>(`/services/${id}`, data);
    return response.data;
  },

  /**
   * Delete service
   */
  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  /**
   * Update service status
   */
  updateServiceStatus: async (id: string, status: boolean): Promise<Service> => {
    const response = await api.patch<Service>(`/services/${id}/status`, { status });
    return response.data;
  },
};
