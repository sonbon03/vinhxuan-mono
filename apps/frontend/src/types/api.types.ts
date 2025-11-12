/**
 * API Response Types
 * These types match the backend ResponseUtil structure
 */

/**
 * Standard API response wrapper from backend
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Paginated response data structure
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

/**
 * Type alias for backward compatibility
 */
export type { PaginatedData as PaginatedResponseData };
