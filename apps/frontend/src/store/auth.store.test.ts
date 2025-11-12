import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';
import { UserRole } from '@shared';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Store', () => {
  const mockUser = {
    id: '123',
    fullName: 'Test User',
    email: 'test@vinhxuan.com',
    role: UserRole.CUSTOMER,
  };

  const mockAccessToken = 'mock_access_token';
  const mockRefreshToken = 'mock_refresh_token';

  beforeEach(() => {
    // Reset the store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });

    // Clear localStorage
    localStorageMock.clear();
  });

  it('should have initial state with user not authenticated', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth state and store tokens in localStorage', () => {
    const { setAuth } = useAuthStore.getState();

    setAuth(mockUser, mockAccessToken, mockRefreshToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe(mockAccessToken);
    expect(state.isAuthenticated).toBe(true);

    // Verify localStorage
    expect(localStorage.getItem('access_token')).toBe(mockAccessToken);
    expect(localStorage.getItem('refresh_token')).toBe(mockRefreshToken);
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockUser);
  });

  it('should clear auth state and remove tokens from localStorage', () => {
    // First set the auth
    const { setAuth, clearAuth } = useAuthStore.getState();
    setAuth(mockUser, mockAccessToken, mockRefreshToken);

    // Then clear it
    clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    // Verify localStorage is cleared
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should update user when setAuth is called multiple times', () => {
    const { setAuth } = useAuthStore.getState();

    // First login
    setAuth(mockUser, mockAccessToken, mockRefreshToken);

    // Second login with different user
    const newUser = {
      ...mockUser,
      id: '456',
      fullName: 'Another User',
      role: UserRole.ADMIN,
    };
    const newAccessToken = 'new_access_token';
    const newRefreshToken = 'new_refresh_token';

    setAuth(newUser, newAccessToken, newRefreshToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(newUser);
    expect(state.accessToken).toBe(newAccessToken);
    expect(localStorage.getItem('access_token')).toBe(newAccessToken);
    expect(localStorage.getItem('refresh_token')).toBe(newRefreshToken);
  });
});
