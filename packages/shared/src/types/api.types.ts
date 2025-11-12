/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | null;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  data: {
    errors?: string[];
  } | null;
}

/**
 * Pagination Params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort Params
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Search Params
 */
export interface SearchParams {
  search?: string;
}
