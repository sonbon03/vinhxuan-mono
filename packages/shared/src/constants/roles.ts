/**
 * User Roles
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

/**
 * Role Permissions
 */
export const ROLE_PERMISSIONS = {
  ADMIN: ['*'], // Full access
  STAFF: [
    'read:users',
    'read:services',
    'write:records',
    'read:records',
    'write:articles',
    'read:consultations',
    'write:consultations',
  ],
  CUSTOMER: [
    'read:services',
    'write:own-records',
    'read:own-records',
    'write:own-consultations',
    'read:own-consultations',
  ],
} as const;
