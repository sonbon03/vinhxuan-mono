import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  HIDDEN = 'HIDDEN',
}

export enum ArticleType {
  NEWS = 'NEWS',
  SHARE = 'SHARE',
  INTERNAL = 'INTERNAL',
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    email: string;
  };
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  status: ArticleStatus;
  type: ArticleType;
  isCrawled: boolean;
  sourceUrl: string | null;
  thumbnail: string | null;
  approverId: string | null;
  approver: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleData {
  title: string;
  slug: string;
  content: string;
  categoryId?: string;
  type?: ArticleType;
  isCrawled?: boolean;
  sourceUrl?: string;
  thumbnail?: string;
}

export interface UpdateArticleData {
  title?: string;
  slug?: string;
  content?: string;
  categoryId?: string;
  type?: ArticleType;
  status?: ArticleStatus;
  sourceUrl?: string;
  thumbnail?: string;
}

export interface QueryArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  categoryId?: string;
  status?: ArticleStatus;
  type?: ArticleType;
  isCrawled?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const articleService = {
  getArticles: async (params: QueryArticlesParams): Promise<PaginatedData<Article>> => {
    const response = await api.get<PaginatedData<Article>>('/articles', { params });
    return response.data;
  },

  getArticleById: async (id: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/slug/${slug}`);
    return response.data;
  },

  createArticle: async (data: CreateArticleData): Promise<Article> => {
    const response = await api.post<Article>('/articles', data);
    return response.data;
  },

  updateArticle: async (id: string, data: UpdateArticleData): Promise<Article> => {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  publishArticle: async (id: string): Promise<Article> => {
    const response = await api.post<Article>(`/articles/${id}/publish`);
    return response.data;
  },

  archiveArticle: async (id: string): Promise<Article> => {
    const response = await api.post<Article>(`/articles/${id}/archive`);
    return response.data;
  },

  toggleHidden: async (id: string): Promise<Article> => {
    const response = await api.post<Article>(`/articles/${id}/toggle-hidden`);
    return response.data;
  },
};
