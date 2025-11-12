import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum ChatSessionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export enum MessageSender {
  USER = 'USER',
  BOT = 'BOT',
  AGENT = 'AGENT',
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: MessageSender;
  messageText: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  status: ChatSessionStatus;
  escalatedAt: string | null;
  messages: ChatMessage[];
  startedAt: string;
  updatedAt: string;
  endedAt: string | null;
}

export interface SendMessageData {
  sessionId?: string;
  messageText: string;
}

export interface SendMessageResponse {
  session: ChatSession;
  userMessage: ChatMessage;
  botResponse: ChatMessage;
}

export const chatbotService = {
  sendMessage: async (data: SendMessageData): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>('/chatbot/message', data);
    return response.data;
  },

  escalateToAgent: async (sessionId: string): Promise<ChatSession> => {
    const response = await api.post<ChatSession>(`/chatbot/escalate/${sessionId}`);
    return response.data;
  },

  getSession: async (id: string): Promise<ChatSession> => {
    const response = await api.get<ChatSession>(`/chatbot/session/${id}`);
    return response.data;
  },

  getAllSessions: async (page?: number, limit?: number): Promise<PaginatedData<ChatSession>> => {
    const response = await api.get<PaginatedData<ChatSession>>('/chatbot/sessions', {
      params: { page, limit },
    });
    return response.data;
  },

  closeSession: async (id: string): Promise<ChatSession> => {
    const response = await api.post<ChatSession>(`/chatbot/session/${id}/close`);
    return response.data;
  },
};
