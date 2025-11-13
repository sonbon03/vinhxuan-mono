import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from './usePermissions';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

describe('usePermissions', () => {
  beforeEach(() => {
    // Reset the auth store
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  describe('hasRole', () => {
    it('should return false when user is not logged in', () => {
      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole(UserRole.ADMIN)).toBe(false);
    });

    it('should return true when user has the required role', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Admin User',
          email: 'admin@vinhxuan.com',
          role: UserRole.ADMIN,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole(UserRole.ADMIN)).toBe(true);
    });

    it('should return true when user has one of the required roles', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Staff User',
          email: 'staff@vinhxuan.com',
          role: UserRole.STAFF,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole([UserRole.ADMIN, UserRole.STAFF])).toBe(true);
    });

    it('should return false when user does not have the required role', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Customer User',
          email: 'customer@vinhxuan.com',
          role: UserRole.CUSTOMER,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.hasRole(UserRole.ADMIN)).toBe(false);
    });
  });

  describe('Role check helpers', () => {
    it('should correctly identify admin role', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Admin User',
          email: 'admin@vinhxuan.com',
          role: UserRole.ADMIN,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isAdmin()).toBe(true);
      expect(result.current.isStaff()).toBe(false);
      expect(result.current.isCustomer()).toBe(false);
    });

    it('should correctly identify staff role', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Staff User',
          email: 'staff@vinhxuan.com',
          role: UserRole.STAFF,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isAdmin()).toBe(false);
      expect(result.current.isStaff()).toBe(true);
      expect(result.current.isCustomer()).toBe(false);
      expect(result.current.isAdminOrStaff()).toBe(true);
    });

    it('should correctly identify customer role', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Customer User',
          email: 'customer@vinhxuan.com',
          role: UserRole.CUSTOMER,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.isAdmin()).toBe(false);
      expect(result.current.isStaff()).toBe(false);
      expect(result.current.isCustomer()).toBe(true);
      expect(result.current.isAdminOrStaff()).toBe(false);
    });
  });

  describe('can - Permission checks', () => {
    it('should allow admin to do anything', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Admin User',
          email: 'admin@vinhxuan.com',
          role: UserRole.ADMIN,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      expect(result.current.can('users', 'create')).toBe(true);
      expect(result.current.can('users', 'delete')).toBe(true);
      expect(result.current.can('services', 'update')).toBe(true);
    });

    it('should restrict staff permissions correctly', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Staff User',
          email: 'staff@vinhxuan.com',
          role: UserRole.STAFF,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      // Staff can read users but not create/update/delete
      expect(result.current.can('users', 'read')).toBe(true);
      expect(result.current.can('users', 'create')).toBe(false);
      expect(result.current.can('users', 'update')).toBe(false);
      expect(result.current.can('users', 'delete')).toBe(false);

      // Staff can read and update records (but not create or delete)
      expect(result.current.can('records', 'create')).toBe(false);
      expect(result.current.can('records', 'read')).toBe(true);
      expect(result.current.can('records', 'update')).toBe(true);
      expect(result.current.can('records', 'delete')).toBe(false);

      // Staff cannot manage employees
      expect(result.current.can('employees', 'create')).toBe(false);
      expect(result.current.can('employees', 'read')).toBe(false);
    });

    it('should restrict customer permissions correctly', () => {
      useAuthStore.setState({
        user: {
          id: '123',
          fullName: 'Customer User',
          email: 'customer@vinhxuan.com',
          role: UserRole.CUSTOMER,
        },
        accessToken: 'token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermissions());

      // Customer can read services
      expect(result.current.can('services', 'read')).toBe(true);
      expect(result.current.can('services', 'create')).toBe(false);

      // Customer can manage own records
      expect(result.current.can('records', 'create')).toBe(true);
      expect(result.current.can('records', 'read')).toBe(true);
      expect(result.current.can('records', 'update')).toBe(true);
      expect(result.current.can('records', 'delete')).toBe(false);

      // Customer cannot access users
      expect(result.current.can('users', 'read')).toBe(false);
      expect(result.current.can('users', 'create')).toBe(false);
    });

    it('should return false for non-existent user', () => {
      const { result } = renderHook(() => usePermissions());

      expect(result.current.can('users', 'read')).toBe(false);
    });
  });
});
