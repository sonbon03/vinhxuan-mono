/**
 * Authentication Context
 * Manages user authentication state globally
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services';
import type { LoginRequest, RegisterRequest } from '../services';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from token on mount
  useEffect(() => {
    const initializeUser = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser({
              id: currentUser.id || currentUser.userId, // Support both localStorage (id) and JWT (userId)
              email: currentUser.email,
              fullName: currentUser.fullName || '',
              role: currentUser.role,
              phone: currentUser.phone || '',
              dateOfBirth: currentUser.dateOfBirth,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      const userData = response.user;

      setUser({
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await authService.register(userData);
      const user = response.user;

      setUser({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id || currentUser.userId, // Support both localStorage (id) and JWT (userId)
          email: currentUser.email,
          fullName: currentUser.fullName || '',
          role: currentUser.role,
          phone: currentUser.phone || '',
          dateOfBirth: currentUser.dateOfBirth,
        });
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
