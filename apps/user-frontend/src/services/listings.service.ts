/**
 * Listings Service
 * Handles property listings API calls
 */

import apiClient from './api.client';

export interface CreateListingRequest {
  title: string;
  content: string;
  price: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

export interface Listing {
  id: string;
  authorId: string;
  author?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  title: string;
  content: string;
  price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isHidden: boolean;
  approverId?: string;
  approver?: {
    id: string;
    fullName: string;
  };
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface ListingResponse {
  statusCode: number;
  message: string;
  data: Listing;
}

export interface ListingsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Listing[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ListingsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
  };
  commentText: string;
  createdAt: string;
}

class ListingsService {
  /**
   * Get all approved listings (public)
   */
  async getAll(query?: ListingsQuery): Promise<ListingsListResponse> {
    const response = await apiClient.get<ListingsListResponse>('/listings', {
      params: {
        ...query,
        status: 'APPROVED', // Only approved listings for public
      },
    });
    return response.data;
  }

  /**
   * Get listing by ID
   */
  async getById(id: string): Promise<ListingResponse> {
    const response = await apiClient.get<ListingResponse>(`/listings/${id}`);
    return response.data;
  }

  /**
   * Create new listing (authenticated users)
   */
  async create(data: CreateListingRequest): Promise<ListingResponse> {
    const response = await apiClient.post<ListingResponse>('/listings', data);
    return response.data;
  }

  /**
   * Update listing (author only)
   */
  async update(id: string, data: UpdateListingRequest): Promise<ListingResponse> {
    const response = await apiClient.put<ListingResponse>(`/listings/${id}`, data);
    return response.data;
  }

  /**
   * Delete listing (author or admin)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/listings/${id}`);
  }

  /**
   * Get user's listings
   */
  async getMyListings(query?: Omit<ListingsQuery, 'status'>): Promise<ListingsListResponse> {
    const response = await apiClient.get<ListingsListResponse>('/listings/my-listings', {
      params: query,
    });
    return response.data;
  }

  /**
   * Add comment to listing
   */
  async addComment(listingId: string, commentText: string): Promise<{ data: Comment }> {
    const response = await apiClient.post(`/listings/${listingId}/comments`, {
      commentText,
    });
    return response.data;
  }

  /**
   * Get listing comments
   */
  async getComments(listingId: string): Promise<{ data: Comment[] }> {
    const response = await apiClient.get(`/listings/${listingId}/comments`);
    return response.data;
  }

  /**
   * Like listing
   */
  async like(listingId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/listings/${listingId}/likes`);
    return response.data;
  }

  /**
   * Unlike listing
   */
  async unlike(listingId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/listings/${listingId}/likes`);
    return response.data;
  }

  /**
   * Check if user liked listing
   */
  async checkLiked(listingId: string): Promise<{ data: { liked: boolean } }> {
    const response = await apiClient.get(`/listings/${listingId}/likes/check`);
    return response.data;
  }
}

export default new ListingsService();
