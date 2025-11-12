import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum ConsultationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Consultation {
  id: string;
  customerId: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
  };
  staffId: string | null;
  staff: {
    id: string;
    name: string;
    email: string;
  } | null;
  serviceId: string | null;
  service: {
    id: string;
    name: string;
    slug: string;
  } | null;
  requestedDatetime: string;
  content: string;
  status: ConsultationStatus;
  cancelReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationData {
  serviceId?: string;
  requestedDatetime: string;
  content: string;
}

export interface UpdateConsultationData {
  serviceId?: string;
  staffId?: string;
  requestedDatetime?: string;
  content?: string;
  notes?: string;
}

export interface ApproveConsultationData {
  staffId?: string;
  notes?: string;
}

export interface CancelConsultationData {
  cancelReason: string;
}

export interface QueryConsultationsParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  staffId?: string;
  serviceId?: string;
  status?: ConsultationStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const consultationService = {
  getConsultations: async (params: QueryConsultationsParams): Promise<PaginatedData<Consultation>> => {
    const response = await api.get<PaginatedData<Consultation>>('/consultations', { params });
    return response.data;
  },

  getMyConsultations: async (params: QueryConsultationsParams): Promise<PaginatedData<Consultation>> => {
    const response = await api.get<PaginatedData<Consultation>>('/consultations/my-consultations', { params });
    return response.data;
  },

  getConsultationById: async (id: string): Promise<Consultation> => {
    const response = await api.get<Consultation>(`/consultations/${id}`);
    return response.data;
  },

  createConsultation: async (data: CreateConsultationData): Promise<Consultation> => {
    const response = await api.post<Consultation>('/consultations', data);
    return response.data;
  },

  updateConsultation: async (id: string, data: UpdateConsultationData): Promise<Consultation> => {
    const response = await api.put<Consultation>(`/consultations/${id}`, data);
    return response.data;
  },

  deleteConsultation: async (id: string): Promise<void> => {
    await api.delete(`/consultations/${id}`);
  },

  approveConsultation: async (id: string, data: ApproveConsultationData): Promise<Consultation> => {
    const response = await api.post<Consultation>(`/consultations/${id}/approve`, data);
    return response.data;
  },

  completeConsultation: async (id: string): Promise<Consultation> => {
    const response = await api.post<Consultation>(`/consultations/${id}/complete`);
    return response.data;
  },

  cancelConsultation: async (id: string, data: CancelConsultationData): Promise<Consultation> => {
    const response = await api.post<Consultation>(`/consultations/${id}/cancel`, data);
    return response.data;
  },
};
