/**
 * Services Service
 * Handles notary services API calls
 */

import apiClient from './api.client';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ServicesResponse {
  statusCode: number;
  message: string;
  data: {
    items: Service[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ServiceDetailResponse {
  statusCode: number;
  message: string;
  data: Service;
}

class ServicesService {
  /**
   * Get all services (with pagination and filters)
   */
  async getAll(query?: ServicesQuery): Promise<ServicesResponse> {
    const response = await apiClient.get<ServicesResponse>('/services', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<ServiceDetailResponse> {
    const response = await apiClient.get<ServiceDetailResponse>(`/services/${id}`);
    return response.data;
  }

  /**
   * Get active services (for public display)
   */
  async getActiveServices(query?: Omit<ServicesQuery, 'status'>): Promise<ServicesResponse> {
    const response = await apiClient.get<ServicesResponse>('/services', {
      params: {
        ...query,
        status: true, // Only active services
      },
    });
    return response.data;
  }
}

export default new ServicesService();
