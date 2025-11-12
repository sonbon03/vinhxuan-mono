/**
 * Fee Calculations Service
 * Handles fee calculation API calls
 */

import apiClient from './api.client';

export interface FeeCalculationRequest {
  documentGroupId: string;
  feeTypeId: string;
  inputData: Record<string, any>;
}

export interface FeeCalculationResult {
  id: string;
  documentGroupId: string;
  feeTypeId: string;
  inputData: Record<string, any>;
  calculationResult: {
    baseFee: number;
    additionalFees: Array<{
      name: string;
      amount: number;
      description: string;
    }>;
    totalFee: number;
    breakdown: string;
  };
  totalFee: number;
  userId?: string;
  createdAt: string;
}

export interface FeeCalculationResponse {
  statusCode: number;
  message: string;
  data: FeeCalculationResult;
}

export interface FeeCalculationsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: FeeCalculationResult[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface DocumentGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  formFields: any;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeType {
  id: string;
  documentGroupId: string;
  name: string;
  calculationMethod: string;
  formula: any;
  baseFee: number;
  percentage: number;
  minFee: number;
  maxFee: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

class FeeCalculationsService {
  /**
   * Calculate fee (works for both guest and authenticated users)
   */
  async calculate(data: FeeCalculationRequest): Promise<FeeCalculationResponse> {
    const response = await apiClient.post<FeeCalculationResponse>('/fee-calculations', data);
    return response.data;
  }

  /**
   * Get user's calculation history (authenticated users only)
   */
  async getMyCalculations(query?: { page?: number; limit?: number }): Promise<FeeCalculationsListResponse> {
    const response = await apiClient.get<FeeCalculationsListResponse>('/fee-calculations/my-calculations', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get calculation by ID
   */
  async getById(id: string): Promise<FeeCalculationResponse> {
    const response = await apiClient.get<FeeCalculationResponse>(`/fee-calculations/${id}`);
    return response.data;
  }

  /**
   * Get all document groups
   */
  async getDocumentGroups(): Promise<{ data: DocumentGroup[] }> {
    const response = await apiClient.get('/document-groups', {
      params: { status: true },
    });
    return response.data;
  }

  /**
   * Get fee types for a document group
   */
  async getFeeTypes(documentGroupId: string): Promise<{ data: { items: FeeType[] } }> {
    const response = await apiClient.get('/fee-types', {
      params: {
        documentGroupId,
        status: true,
      },
    });
    return response.data;
  }

  /**
   * Get fee type by ID
   */
  async getFeeTypeById(id: string): Promise<{ data: FeeType }> {
    const response = await apiClient.get(`/fee-types/${id}`);
    return response.data;
  }
}

export default new FeeCalculationsService();
