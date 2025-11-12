import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@shared';

/**
 * Custom hook to check user permissions based on roles
 */
export function usePermissions() {
  const { user } = useAuthStore();

  /**
   * Check if user has one of the required roles
   */
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  };

  /**
   * Check if user is Admin
   */
  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };

  /**
   * Check if user is Staff
   */
  const isStaff = (): boolean => {
    return user?.role === UserRole.STAFF;
  };

  /**
   * Check if user is Customer
   */
  const isCustomer = (): boolean => {
    return user?.role === UserRole.CUSTOMER;
  };

  /**
   * Check if user is Admin or Staff
   */
  const isAdminOrStaff = (): boolean => {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  };

  /**
   * Check if user can perform an action based on permissions matrix
   * Returns true if user has permission to perform the action
   */
  const can = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === UserRole.ADMIN) return true;

    // Define permission matrix based on CLAUDE.md specifications
    const permissions: Record<UserRole, Record<string, string[]>> = {
      [UserRole.ADMIN]: {
        '*': ['create', 'read', 'update', 'delete'],
      },
      [UserRole.STAFF]: {
        users: ['read'],
        employees: [],
        services: ['create', 'read', 'update', 'delete'],
        documentGroups: ['create', 'read', 'update', 'delete'],
        feeTypes: ['create', 'read', 'update', 'delete'],
        feeCalculations: ['create', 'read'],
        records: ['read', 'update'], // Staff can view all and approve/reject
        articles: ['create', 'read'],
        categories: ['create', 'read', 'update', 'delete'],
        listings: ['read', 'update'],
        consultations: ['read', 'update', 'delete'],
        campaigns: ['read'],
        files: ['create', 'read', 'delete'],
      },
      [UserRole.CUSTOMER]: {
        services: ['read'],
        feeTypes: ['read'],
        feeCalculations: ['create', 'read'],
        records: ['create', 'read', 'update'],
        articles: ['read'],
        categories: ['read'],
        listings: ['create', 'read', 'update', 'delete'],
        consultations: ['create', 'read', 'delete'],
        files: ['create', 'read', 'delete'],
      },
    };

    const userPermissions = permissions[user.role];
    if (!userPermissions) return false;

    // Check if user has wildcard permission
    if (userPermissions['*'] && userPermissions['*'].includes(action)) {
      return true;
    }

    // Check specific module permission
    const modulePermissions = userPermissions[module];
    if (!modulePermissions) return false;

    return modulePermissions.includes(action);
  };

  return {
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
    isAdminOrStaff,
    can,
    user,
  };
}
