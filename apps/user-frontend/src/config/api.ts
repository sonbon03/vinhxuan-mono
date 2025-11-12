/**
 * API Configuration for User Frontend
 * Connects to the vinhxuan-cms backend API
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8830/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.baseURL}${cleanEndpoint}`;
};

export default API_CONFIG;
