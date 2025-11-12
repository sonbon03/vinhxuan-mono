/**
 * Consultations Hooks
 * React Query hooks for consultation booking operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import consultationsService, {
  type CreateConsultationRequest,
  type ConsultationsQuery,
} from '@/services/consultations.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to create a new consultation booking
 */
export const useCreateConsultation = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateConsultationRequest) => {
      if (!isAuthenticated) {
        throw new Error('Bạn phải đăng nhập để đặt lịch tư vấn');
      }
      return consultationsService.create(data);
    },
    onSuccess: (response) => {
      // Invalidate consultations list to refetch
      queryClient.invalidateQueries({ queryKey: ['my-consultations'] });

      toast.success('Đặt lịch thành công!', {
        description: 'Chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ.',
        duration: 5000,
        action: {
          label: 'Xem chi tiết',
          onClick: () => {
            if (response?.data?.id) {
              navigate(`/dashboard/consultations/${response.data.id}`);
            } else {
              navigate('/dashboard/consultations');
            }
          },
        },
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.';
      const status = error.response?.status;

      if (status === 401) {
        toast.error('Phiên đăng nhập hết hạn', {
          description: 'Vui lòng đăng nhập lại để tiếp tục.',
          action: {
            label: 'Đăng nhập',
            onClick: () => navigate('/login?returnUrl=/contact'),
          },
        });
      } else if (status === 400) {
        toast.error('Thông tin không hợp lệ', {
          description: message,
        });
      } else {
        toast.error('Lỗi đặt lịch', {
          description: message,
        });
      }

      console.error('Consultation booking error:', error);
    },
  });
};

/**
 * Hook to fetch user's consultations
 */
export const useMyConsultations = (query?: ConsultationsQuery) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['my-consultations', query],
    queryFn: () => consultationsService.getMyConsultations(query),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch a single consultation by ID
 */
export const useConsultation = (id: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['consultation', id],
    queryFn: () => consultationsService.getById(id),
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to cancel a consultation
 */
export const useCancelConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      consultationsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-consultations'] });
      queryClient.invalidateQueries({ queryKey: ['consultation'] });

      toast.success('Hủy lịch thành công', {
        description: 'Lịch tư vấn đã được hủy.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Hủy lịch thất bại. Vui lòng thử lại.';

      toast.error('Lỗi hủy lịch', {
        description: message,
      });

      console.error('Cancel consultation error:', error);
    },
  });
};
