import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum RecordStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Record {
  id: string;
  customerId: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
  };
  typeId: string;
  type: {
    id: string;
    name: string;
    slug: string;
  };
  title: string;
  description: string | null;
  attachments: string[] | null;
  status: RecordStatus;
  reviewNotes: string | null;
  reviewerId: string | null;
  reviewer: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordData {
  typeId: string;
  title: string;
  description?: string;
  attachments?: string[];
}

export interface UpdateRecordData {
  typeId?: string;
  title?: string;
  description?: string;
  attachments?: string[];
  status?: RecordStatus;
  reviewNotes?: string;
}

export interface QueryRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  typeId?: string;
  status?: RecordStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ReviewRecordData {
  reviewNotes?: string;
}

export const recordService = {
  getRecords: async (params: QueryRecordsParams): Promise<PaginatedData<Record>> => {
    const response = await api.get<PaginatedData<Record>>('/records', { params });
    return response.data;
  },

  getRecordById: async (id: string): Promise<Record> => {
    const response = await api.get<Record>(`/records/${id}`);
    return response.data;
  },

  createRecord: async (data: CreateRecordData): Promise<Record> => {
    const response = await api.post<Record>('/records', data);
    return response.data;
  },

  updateRecord: async (id: string, data: UpdateRecordData): Promise<Record> => {
    const response = await api.put<Record>(`/records/${id}`, data);
    return response.data;
  },

  deleteRecord: async (id: string): Promise<void> => {
    await api.delete(`/records/${id}`);
  },

  approveRecord: async (id: string, data: ReviewRecordData): Promise<Record> => {
    const response = await api.post<Record>(`/records/${id}/approve`, data);
    return response.data;
  },

  rejectRecord: async (id: string, data: ReviewRecordData): Promise<Record> => {
    const response = await api.post<Record>(`/records/${id}/reject`, data);
    return response.data;
  },
};
