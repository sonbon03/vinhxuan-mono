/**
 * Custom hooks for Listings API
 * Provides React Query hooks for managing listings data and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import listingsService, {
  ListingsQuery,
  CreateListingRequest,
  UpdateListingRequest,
  ListingsListResponse,
  ListingResponse
} from '@/services/listings.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch all approved listings with pagination and filters
 */
export const useListings = (
  query?: ListingsQuery,
  options?: Omit<UseQueryOptions<ListingsListResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ListingsListResponse>({
    queryKey: ['listings', query],
    queryFn: () => listingsService.getAll(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch a single listing by ID
 */
export const useListing = (id: string | undefined) => {
  return useQuery<ListingResponse>({
    queryKey: ['listing', id],
    queryFn: () => listingsService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to fetch current user's listings
 */
export const useMyListings = (query?: Omit<ListingsQuery, 'status'>) => {
  const { isAuthenticated } = useAuth();

  return useQuery<ListingsListResponse>({
    queryKey: ['my-listings', query],
    queryFn: () => listingsService.getMyListings(query),
    enabled: isAuthenticated,
  });
};

/**
 * Hook to create a new listing
 * CRITICAL: Requires authentication
 */
export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (data: CreateListingRequest) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để tạo tin đăng');
      }
      return listingsService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast({
        title: 'Thành công',
        description: 'Tin đăng của bạn đã được tạo và đang chờ phê duyệt.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Không thể tạo tin đăng';
      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing listing
 */
export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingRequest }) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để cập nhật tin đăng');
      }
      return listingsService.update(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast({
        title: 'Thành công',
        description: 'Tin đăng đã được cập nhật.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Không thể cập nhật tin đăng';
      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a listing
 */
export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để xóa tin đăng');
      }
      return listingsService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast({
        title: 'Thành công',
        description: 'Tin đăng đã được xóa.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Không thể xóa tin đăng';
      toast({
        title: 'Lỗi',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to like/unlike a listing
 * CRITICAL: Requires authentication
 */
export const useLikeListing = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (listingId: string) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để thích tin đăng');
      }
      return listingsService.like(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast({
        title: 'Đã thích',
        description: 'Bạn đã thích tin đăng này.',
      });
    },
    onError: (error: any) => {
      if (error.message.includes('đăng nhập')) {
        toast({
          title: 'Yêu cầu đăng nhập',
          description: 'Vui lòng đăng nhập để thích tin đăng.',
          variant: 'destructive',
        });
      } else {
        const message = error.response?.data?.message || 'Không thể thích tin đăng';
        toast({
          title: 'Lỗi',
          description: message,
          variant: 'destructive',
        });
      }
    },
  });
};

/**
 * Hook to check if user liked a listing
 */
export const useCheckLiked = (listingId: string | undefined) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['liked', listingId],
    queryFn: () => listingsService.checkLiked(listingId!),
    enabled: !!listingId && isAuthenticated,
  });
};

/**
 * Hook to add a comment to a listing
 * CRITICAL: Requires authentication
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: ({ listingId, commentText }: { listingId: string; commentText: string }) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để bình luận');
      }
      return listingsService.addComment(listingId, commentText);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
      toast({
        title: 'Thành công',
        description: 'Bình luận của bạn đã được thêm.',
      });
    },
    onError: (error: any) => {
      if (error.message.includes('đăng nhập')) {
        toast({
          title: 'Yêu cầu đăng nhập',
          description: 'Vui lòng đăng nhập để bình luận.',
          variant: 'destructive',
        });
      } else {
        const message = error.response?.data?.message || 'Không thể thêm bình luận';
        toast({
          title: 'Lỗi',
          description: message,
          variant: 'destructive',
        });
      }
    },
  });
};

/**
 * Hook to fetch comments for a listing
 */
export const useListingComments = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: () => listingsService.getComments(listingId!),
    enabled: !!listingId,
  });
};
