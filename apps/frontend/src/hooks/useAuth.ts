import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@shared';

/**
 * Custom hook to access authentication state and utilities
 */
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return user?.role === UserRole.ADMIN;
  }, [user]);

  // Check if user is staff
  const isStaff = useMemo(() => {
    return user?.role === UserRole.STAFF;
  }, [user]);

  // Check if user is customer
  const isCustomer = useMemo(() => {
    return user?.role === UserRole.CUSTOMER;
  }, [user]);

  // Check if user has specific role
  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  return {
    // State
    user,
    accessToken,
    isAuthenticated,

    // Role checks
    isAdmin,
    isStaff,
    isCustomer,
    hasRole,

    // Actions
    setAuth,
    clearAuth,
  };
};
