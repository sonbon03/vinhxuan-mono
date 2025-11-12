/**
 * Authentication Service
 * Handles user authentication, registration, and password management
 */

import apiClient, { tokenManager } from './api.client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
    dateOfBirth?: string;
  };
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ statusCode: number; message: string; data: AuthResponse }>('/auth/login', credentials);

    // Store tokens and user info
    const { accessToken, refreshToken, user } = response.data.data;
    tokenManager.setTokens(accessToken, refreshToken, user);

    return response.data.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ statusCode: number; message: string; data: AuthResponse }>('/auth/register', userData);

    // Optionally auto-login after registration
    const { accessToken, refreshToken, user } = response.data.data;
    tokenManager.setTokens(accessToken, refreshToken, user);

    return response.data.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ statusCode: number; message: string; data: AuthResponse }>('/auth/refresh', {
      refreshToken,
    });

    // Update tokens and user info
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data.data;
    tokenManager.setTokens(newAccessToken, newRefreshToken, user);

    return response.data.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.patch<{ statusCode: number; message: string; data: { message: string } }>('/auth/change-password', data);
    return response.data.data;
  }

  /**
   * Logout user
   */
  logout() {
    tokenManager.clearTokens();
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  /**
   * Get current user from localStorage or token (decode JWT)
   */
  getCurrentUser(): any | null {
    // First try to get user from localStorage
    const storedUser = tokenManager.getUser();
    if (storedUser) {
      return storedUser;
    }

    // Fallback to decoding JWT token
    const token = tokenManager.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      // Decode JWT (basic decoding, for production consider using a library)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

export default new AuthService();
