import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum ListingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Listing {
  id: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    email: string;
  };
  title: string;
  content: string;
  price: number | null;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: string[] | null;
  status: ListingStatus;
  isHidden: boolean;
  likeCount: number;
  commentCount: number;
  approverId: string | null;
  approver: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingComment {
  id: string;
  listingId: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  commentText: string;
  createdAt: string;
}

export interface CreateListingData {
  title: string;
  content: string;
  price?: number;
  categoryId?: string;
  images?: string[];
}

export interface UpdateListingData {
  title?: string;
  content?: string;
  price?: number;
  categoryId?: string;
  images?: string[];
}

export interface ReviewListingData {
  reviewNotes?: string;
}

export interface CreateCommentData {
  commentText: string;
}

export interface QueryListingsParams {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  categoryId?: string;
  status?: ListingStatus;
  minPrice?: number;
  maxPrice?: number;
  isHidden?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const listingService = {
  getListings: async (params: QueryListingsParams): Promise<PaginatedData<Listing>> => {
    const response = await api.get<PaginatedData<Listing>>('/listings', { params });
    return response.data;
  },

  getMyListings: async (params: QueryListingsParams): Promise<PaginatedData<Listing>> => {
    const response = await api.get<PaginatedData<Listing>>('/listings/my-listings', { params });
    return response.data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const response = await api.get<Listing>(`/listings/${id}`);
    return response.data;
  },

  createListing: async (data: CreateListingData): Promise<Listing> => {
    const response = await api.post<Listing>('/listings', data);
    return response.data;
  },

  updateListing: async (id: string, data: UpdateListingData): Promise<Listing> => {
    const response = await api.put<Listing>(`/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },

  approveListing: async (id: string, data: ReviewListingData): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/approve`, data);
    return response.data;
  },

  rejectListing: async (id: string, data: ReviewListingData): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/reject`, data);
    return response.data;
  },

  toggleHidden: async (id: string): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/toggle-hidden`);
    return response.data;
  },

  // Comments
  addComment: async (id: string, data: CreateCommentData): Promise<ListingComment> => {
    const response = await api.post<ListingComment>(`/listings/${id}/comments`, data);
    return response.data;
  },

  getComments: async (id: string): Promise<ListingComment[]> => {
    const response = await api.get<ListingComment[]>(`/listings/${id}/comments`);
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/listings/comments/${commentId}`);
  },

  // Likes
  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await api.post<{ liked: boolean; likeCount: number }>(`/listings/${id}/like`);
    return response.data;
  },

  checkUserLiked: async (id: string): Promise<{ liked: boolean }> => {
    const response = await api.get<{ liked: boolean }>(`/listings/${id}/liked`);
    return response.data;
  },
};
