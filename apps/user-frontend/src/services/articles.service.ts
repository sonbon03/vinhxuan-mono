/**
 * Articles Service
 * Handles articles/news API calls
 */

import apiClient from './api.client';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  author?: {
    id: string;
    fullName: string;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'HIDDEN';
  type: 'NEWS' | 'SHARE' | 'INTERNAL';
  isCrawled: boolean;
  sourceUrl?: string;
  approverId?: string;
  approver?: {
    id: string;
    fullName: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleResponse {
  statusCode: number;
  message: string;
  data: Article;
}

export interface ArticlesListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Article[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ArticlesQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'NEWS' | 'SHARE' | 'INTERNAL';
  categoryId?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class ArticlesService {
  /**
   * Get all published articles
   */
  async getAll(query?: ArticlesQuery): Promise<ArticlesListResponse> {
    const response = await apiClient.get<ArticlesListResponse>('/articles', {
      params: {
        ...query,
        status: 'PUBLISHED', // Only get published articles for public
      },
    });
    return response.data;
  }

  /**
   * Get article by ID
   */
  async getById(id: string): Promise<ArticleResponse> {
    const response = await apiClient.get<ArticleResponse>(`/articles/${id}`);
    return response.data;
  }

  /**
   * Get article by slug
   */
  async getBySlug(slug: string): Promise<ArticleResponse> {
    const response = await apiClient.get<ArticleResponse>(`/articles/slug/${slug}`);
    return response.data;
  }

  /**
   * Get news articles (type: NEWS)
   */
  async getNews(query?: Omit<ArticlesQuery, 'type'>): Promise<ArticlesListResponse> {
    return this.getAll({
      ...query,
      type: 'NEWS',
    });
  }

  /**
   * Get share articles (type: SHARE)
   */
  async getShares(query?: Omit<ArticlesQuery, 'type'>): Promise<ArticlesListResponse> {
    return this.getAll({
      ...query,
      type: 'SHARE',
    });
  }

  /**
   * Get latest articles
   */
  async getLatest(limit: number = 5): Promise<ArticlesListResponse> {
    return this.getAll({
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'DESC',
    });
  }

  /**
   * Get related articles by category
   */
  async getRelated(categoryId: string, excludeId: string, limit: number = 4): Promise<ArticlesListResponse> {
    return this.getAll({
      categoryId,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'DESC',
    });
  }
}

export default new ArticlesService();
