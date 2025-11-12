/**
 * Services Index
 * Central export point for all API services
 */

export { default as authService } from './auth.service';
export { default as servicesService } from './services.service';
export { default as feeCalculationsService } from './fee-calculations.service';
export { default as consultationsService } from './consultations.service';
export { default as articlesService } from './articles.service';
export { default as listingsService } from './listings.service';
export { default as apiClient, tokenManager } from './api.client';

// Re-export types
export type { LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest } from './auth.service';
export type { Service, ServicesQuery, ServicesResponse, ServiceDetailResponse } from './services.service';
export type {
  FeeCalculationRequest,
  FeeCalculationResult,
  FeeCalculationResponse,
  FeeCalculationsListResponse,
  DocumentGroup,
  FeeType,
} from './fee-calculations.service';
export type {
  CreateConsultationRequest,
  Consultation,
  ConsultationResponse,
  ConsultationsListResponse,
  ConsultationsQuery,
} from './consultations.service';
export type {
  Article,
  ArticleResponse,
  ArticlesListResponse,
  ArticlesQuery,
} from './articles.service';
export type {
  CreateListingRequest,
  UpdateListingRequest,
  Listing,
  ListingResponse,
  ListingsListResponse,
  ListingsQuery,
  Comment,
} from './listings.service';
