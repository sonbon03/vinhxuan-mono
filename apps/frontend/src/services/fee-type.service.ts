import api from './api';
import type { PaginatedData } from '../types/api.types';

export enum CalculationMethod {
  FIXED = 'FIXED',
  PERCENT = 'PERCENT',
  VALUE_BASED = 'VALUE_BASED',
  TIERED = 'TIERED',
  FORMULA = 'FORMULA',
}

export interface TieredPricingTier {
  from: number;
  to: number | null;
  rate: number;
  description?: string;
}

export interface AdditionalFee {
  name: string;
  amount: number;
  perUnit: boolean;
  description?: string;
}

export interface FormulaSchema {
  method: CalculationMethod;
  tiers?: TieredPricingTier[];
  additionalFees?: AdditionalFee[];
  customFormula?: string;
}

export interface FeeType {
  id: string;
  documentGroupId: string;
  documentGroup?: {
    id: string;
    name: string;
    slug: string;
  };
  name: string;
  calculationMethod: CalculationMethod;
  formula?: FormulaSchema;
  baseFee?: number;
  percentage?: number;
  minFee?: number;
  maxFee?: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryFeeTypesParams {
  page?: number;
  limit?: number;
  search?: string;
  documentGroupId?: string;
  calculationMethod?: CalculationMethod;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateFeeTypeData {
  documentGroupId: string;
  name: string;
  calculationMethod: CalculationMethod;
  formula?: FormulaSchema;
  baseFee?: number;
  percentage?: number;
  minFee?: number;
  maxFee?: number;
  status?: boolean;
}

export interface UpdateFeeTypeData {
  documentGroupId?: string;
  name?: string;
  calculationMethod?: CalculationMethod;
  formula?: FormulaSchema;
  baseFee?: number;
  percentage?: number;
  minFee?: number;
  maxFee?: number;
  status?: boolean;
}

export const feeTypeService = {
  /**
   * Get all fee types with pagination and filters
   */
  getFeeTypes: async (params: QueryFeeTypesParams): Promise<PaginatedData<FeeType>> => {
    const response = await api.get<PaginatedData<FeeType>>('/fee-types', { params });
    return response.data;
  },

  /**
   * Get fee type by ID
   */
  getFeeTypeById: async (id: string): Promise<FeeType> => {
    const response = await api.get<FeeType>(`/fee-types/${id}`);
    return response.data;
  },

  /**
   * Get fee types by document group ID
   */
  getFeeTypesByDocumentGroup: async (documentGroupId: string): Promise<FeeType[]> => {
    const response = await api.get<FeeType[]>(`/fee-types/document-group/${documentGroupId}`);
    return response.data;
  },

  /**
   * Create new fee type
   */
  createFeeType: async (data: CreateFeeTypeData): Promise<FeeType> => {
    const response = await api.post<FeeType>('/fee-types', data);
    return response.data;
  },

  /**
   * Update fee type
   */
  updateFeeType: async (id: string, data: UpdateFeeTypeData): Promise<FeeType> => {
    const response = await api.patch<FeeType>(`/fee-types/${id}`, data);
    return response.data;
  },

  /**
   * Delete fee type
   */
  deleteFeeType: async (id: string): Promise<void> => {
    await api.delete(`/fee-types/${id}`);
  },

  /**
   * Update fee type status
   */
  updateFeeTypeStatus: async (id: string, status: boolean): Promise<FeeType> => {
    const response = await api.patch<FeeType>(`/fee-types/${id}/status`, { status });
    return response.data;
  },
};
