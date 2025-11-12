import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum EventType {
  BIRTHDAY = 'BIRTHDAY',
  HOLIDAY = 'HOLIDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  OTHER = 'OTHER',
}

export interface EmailCampaign {
  id: string;
  title: string;
  eventType: EventType;
  subject: string;
  template: string;
  schedule: any;
  recipientCriteria: any;
  status: boolean;
  lastSentAt: string | null;
  sentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailCampaignData {
  title: string;
  eventType: EventType;
  subject: string;
  template: string;
  schedule?: any;
  recipientCriteria?: any;
  status?: boolean;
}

export interface UpdateEmailCampaignData {
  title?: string;
  eventType?: EventType;
  subject?: string;
  template?: string;
  schedule?: any;
  recipientCriteria?: any;
  status?: boolean;
}

export interface QueryEmailCampaignsParams {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: EventType;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const emailCampaignService = {
  getEmailCampaigns: async (params: QueryEmailCampaignsParams): Promise<PaginatedData<EmailCampaign>> => {
    const response = await api.get<PaginatedData<EmailCampaign>>('/email-campaigns', { params });
    return response.data;
  },

  getEmailCampaignById: async (id: string): Promise<EmailCampaign> => {
    const response = await api.get<EmailCampaign>(`/email-campaigns/${id}`);
    return response.data;
  },

  createEmailCampaign: async (data: CreateEmailCampaignData): Promise<EmailCampaign> => {
    const response = await api.post<EmailCampaign>('/email-campaigns', data);
    return response.data;
  },

  updateEmailCampaign: async (id: string, data: UpdateEmailCampaignData): Promise<EmailCampaign> => {
    const response = await api.put<EmailCampaign>(`/email-campaigns/${id}`, data);
    return response.data;
  },

  deleteEmailCampaign: async (id: string): Promise<void> => {
    await api.delete(`/email-campaigns/${id}`);
  },

  toggleStatus: async (id: string): Promise<EmailCampaign> => {
    const response = await api.post<EmailCampaign>(`/email-campaigns/${id}/toggle-status`);
    return response.data;
  },

  sendCampaign: async (id: string): Promise<{ success: boolean; sentCount: number }> => {
    const response = await api.post<{ success: boolean; sentCount: number }>(`/email-campaigns/${id}/send`);
    return response.data;
  },
};
