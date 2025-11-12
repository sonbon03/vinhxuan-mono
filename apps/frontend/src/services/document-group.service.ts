import api from './api';
import type { PaginatedData } from '../types/api.types';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface FormFieldsSchema {
  fields: FormField[];
}

export interface DocumentGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
  formFields?: FormFieldsSchema;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryDocumentGroupsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateDocumentGroupData {
  name: string;
  slug: string;
  description?: string;
  formFields?: FormFieldsSchema;
  status?: boolean;
}

export interface UpdateDocumentGroupData {
  name?: string;
  slug?: string;
  description?: string;
  formFields?: FormFieldsSchema;
  status?: boolean;
}

export const documentGroupService = {
  /**
   * Get all document groups with pagination and filters
   */
  getDocumentGroups: async (params: QueryDocumentGroupsParams): Promise<PaginatedData<DocumentGroup>> => {
    const response = await api.get<PaginatedData<DocumentGroup>>('/document-groups', { params });
    return response.data;
  },

  /**
   * Get document group by ID
   */
  getDocumentGroupById: async (id: string): Promise<DocumentGroup> => {
    const response = await api.get<DocumentGroup>(`/document-groups/${id}`);
    return response.data;
  },

  /**
   * Create new document group
   */
  createDocumentGroup: async (data: CreateDocumentGroupData): Promise<DocumentGroup> => {
    const response = await api.post<DocumentGroup>('/document-groups', data);
    return response.data;
  },

  /**
   * Update document group
   */
  updateDocumentGroup: async (id: string, data: UpdateDocumentGroupData): Promise<DocumentGroup> => {
    const response = await api.patch<DocumentGroup>(`/document-groups/${id}`, data);
    return response.data;
  },

  /**
   * Delete document group
   */
  deleteDocumentGroup: async (id: string): Promise<void> => {
    await api.delete(`/document-groups/${id}`);
  },

  /**
   * Update document group status
   */
  updateDocumentGroupStatus: async (id: string, status: boolean): Promise<DocumentGroup> => {
    const response = await api.patch<DocumentGroup>(`/document-groups/${id}/status`, { status });
    return response.data;
  },
};
