import api from './api';
import type { PaginatedData } from '../types/api.types';

export interface CalculationDetail {
  baseFee?: number;
  percentageFee?: number;
  tieredFees?: {
    tier: number;
    from: number;
    to: number | null;
    rate: number;
    amount: number;
    description: string;
  }[];
  additionalFees?: {
    name: string;
    amount: number;
    quantity?: number;
    total: number;
    description: string;
  }[];
  subtotal: number;
  totalFee: number;
}

export interface FeeCalculation {
  id: string;
  userId?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  documentGroupId: string;
  documentGroup: {
    id: string;
    name: string;
    slug: string;
  };
  feeTypeId: string;
  feeType: {
    id: string;
    name: string;
    calculationMethod: string;
  };
  inputData: Record<string, any>;
  calculationResult: CalculationDetail;
  totalFee: number;
  createdAt: string;
}

export interface QueryFeeCalculationsParams {
  page?: number;
  limit?: number;
  userId?: string;
  documentGroupId?: string;
  feeTypeId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateFeeCalculationData {
  documentGroupId: string;
  feeTypeId: string;
  inputData: Record<string, any>;
}

export const feeCalculationService = {
  /**
   * Calculate fee (public endpoint - works for guest users)
   */
  calculateFee: async (data: CreateFeeCalculationData): Promise<FeeCalculation> => {
    const response = await api.post<FeeCalculation>('/fee-calculations', data);
    return response.data;
  },

  /**
   * Get all fee calculations (Admin/Staff only)
   */
  getFeeCalculations: async (params: QueryFeeCalculationsParams): Promise<PaginatedData<FeeCalculation>> => {
    const response = await api.get<PaginatedData<FeeCalculation>>('/fee-calculations', { params });
    return response.data;
  },

  /**
   * Get my fee calculation history (authenticated users)
   */
  getMyCalculations: async (params: QueryFeeCalculationsParams): Promise<PaginatedData<FeeCalculation>> => {
    const response = await api.get<PaginatedData<FeeCalculation>>('/fee-calculations/my-calculations', { params });
    return response.data;
  },

  /**
   * Get fee calculation by ID
   */
  getFeeCalculationById: async (id: string): Promise<FeeCalculation> => {
    const response = await api.get<FeeCalculation>(`/fee-calculations/${id}`);
    return response.data;
  },
};
