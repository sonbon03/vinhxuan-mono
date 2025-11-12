import axios from 'axios';
import type { ApiResponse } from '../types/api.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8830/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Unwrap the backend response structure
    // Backend returns { statusCode, message, data }
    // We extract the data property so services can use it directly
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const apiResponse = response.data as ApiResponse;
      response.data = apiResponse.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post<ApiResponse>(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken },
          );

          // Extract data from the wrapped response
          const authData = response.data.data as any;
          const { accessToken, refreshToken: newRefreshToken } = authData;
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
