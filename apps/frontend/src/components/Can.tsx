import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types';

interface CanProps {
  /**
   * Required roles - user must have one of these roles
   */
  roles?: UserRole | UserRole[];

  /**
   * Module and action for permission check
   */
  module?: string;
  action?: 'create' | 'read' | 'update' | 'delete';

  /**
   * Children to render if user has permission
   */
  children: ReactNode;

  /**
   * Optional fallback to render if user doesn't have permission
   */
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user permissions
 *
 * Usage:
 * ```tsx
 * <Can roles={UserRole.ADMIN}>
 *   <Button>Admin Only Button</Button>
 * </Can>
 *
 * <Can roles={[UserRole.ADMIN, UserRole.STAFF]}>
 *   <Button>Admin or Staff Button</Button>
 * </Can>
 *
 * <Can module="users" action="create">
 *   <Button>Create User</Button>
 * </Can>
 *
 * <Can module="users" action="delete" fallback={<Text>No permission</Text>}>
 *   <Button danger>Delete User</Button>
 * </Can>
 * ```
 */
export function Can({ roles, module, action, children, fallback = null }: CanProps) {
  const { hasRole, can } = usePermissions();

  // Check role-based permission
  if (roles) {
    if (!hasRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // Check module/action permission
  if (module && action) {
    if (!can(module, action)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Default export for backward compatibility
export default Can;
