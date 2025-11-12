/**
 * Consultations Service
 * Handles consultation booking API calls
 */

import apiClient from './api.client';

export interface CreateConsultationRequest {
  requestedDatetime: string;
  content: string;
  serviceId?: string;
}

export interface Consultation {
  id: string;
  customerId: string;
  customer?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  staffId?: string;
  staff?: {
    id: string;
    fullName: string;
    email: string;
  };
  serviceId?: string;
  service?: {
    id: string;
    name: string;
  };
  requestedDatetime: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  cancelReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationResponse {
  statusCode: number;
  message: string;
  data: Consultation;
}

export interface ConsultationsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Consultation[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ConsultationsQuery {
  page?: number;
  limit?: number;
  status?: string;
  serviceId?: string;
  fromDate?: string;
  toDate?: string;
}

class ConsultationsService {
  /**
   * Create a new consultation booking
   */
  async create(data: CreateConsultationRequest): Promise<ConsultationResponse> {
    const response = await apiClient.post<ConsultationResponse>('/consultations', data);
    return response.data;
  }

  /**
   * Get user's consultations
   */
  async getMyConsultations(query?: ConsultationsQuery): Promise<ConsultationsListResponse> {
    const response = await apiClient.get<ConsultationsListResponse>('/consultations', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get consultation by ID
   */
  async getById(id: string): Promise<ConsultationResponse> {
    const response = await apiClient.get<ConsultationResponse>(`/consultations/${id}`);
    return response.data;
  }

  /**
   * Cancel consultation
   */
  async cancel(id: string, reason: string): Promise<ConsultationResponse> {
    const response = await apiClient.post<ConsultationResponse>(`/consultations/${id}/cancel`, {
      cancelReason: reason,
    });
    return response.data;
  }
}

export default new ConsultationsService();
