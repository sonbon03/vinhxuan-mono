import { create } from 'zustand';
import { UserRole } from '@/types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

// Helper function to load auth state from localStorage
const loadAuthFromStorage = () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (accessToken && userStr) {
      const user = JSON.parse(userStr) as User;
      return {
        user,
        accessToken,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  // Initialize from localStorage
  ...loadAuthFromStorage(),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
