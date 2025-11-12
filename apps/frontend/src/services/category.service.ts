import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum ModuleType {
  SERVICE = 'SERVICE',
  ARTICLE = 'ARTICLE',
  LISTING = 'LISTING',
  RECORD = 'RECORD',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  moduleType: ModuleType;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  moduleType?: ModuleType;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  moduleType: ModuleType;
  status?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  moduleType?: ModuleType;
  status?: boolean;
}

export const categoryService = {
  /**
   * Get all categories with pagination and filters
   */
  getCategories: async (params: QueryCategoriesParams): Promise<PaginatedData<Category>> => {
    const response = await api.get<PaginatedData<Category>>('/categories', { params });
    return response.data;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create new category
   */
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Update category
   */
  updateCategory: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  /**
   * Update category status
   */
  updateCategoryStatus: async (id: string, status: boolean): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}/status`, { status });
    return response.data;
  },
};
