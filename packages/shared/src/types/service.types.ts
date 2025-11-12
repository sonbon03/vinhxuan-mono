/**
 * Service Interface
 */
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Service DTO
 */
export interface CreateServiceDto {
  name: string;
  slug: string;
  description: string;
  price: number;
}

/**
 * Update Service DTO
 */
export interface UpdateServiceDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  status?: boolean;
}

/**
 * Service Query DTO
 */
export interface ServiceQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: 'createdAt' | 'name' | 'price';
  sortOrder?: 'ASC' | 'DESC';
}
