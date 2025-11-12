/**
 * Custom hooks for Articles/News
 */

import { useQuery } from '@tanstack/react-query';
import articlesService, { type ArticlesQuery } from '@/services/articles.service';

/**
 * Hook to fetch news articles (type: NEWS)
 */
export const useNews = (query?: Omit<ArticlesQuery, 'type'>) => {
  return useQuery({
    queryKey: ['news', query],
    queryFn: () => articlesService.getNews(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch article by slug
 */
export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articlesService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch related articles by category
 */
export const useRelatedArticles = (categoryId?: string, excludeId?: string, limit: number = 2) => {
  return useQuery({
    queryKey: ['related-articles', categoryId, excludeId, limit],
    queryFn: () => articlesService.getRelated(categoryId!, excludeId!, limit),
    enabled: !!categoryId && !!excludeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch latest breaking news (top 3)
 */
export const useBreakingNews = (limit: number = 3) => {
  return useQuery({
    queryKey: ['breaking-news', limit],
    queryFn: () => articlesService.getNews({ limit, sortBy: 'publishedAt', sortOrder: 'DESC' }),
    staleTime: 2 * 60 * 1000, // 2 minutes (refresh more frequently for breaking news)
  });
};
