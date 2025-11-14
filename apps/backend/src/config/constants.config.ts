/**
 * Application Constants Configuration
 *
 * This file contains hardcoded configuration values that should NOT be
 * environment variables. These are application-level constants that are
 * the same across all environments.
 *
 * For environment-specific values (database credentials, API keys, etc.),
 * continue using environment variables.
 */

/**
 * JWT Token Expiration Times
 * These are hardcoded for consistency across all environments
 */
export const JWT_CONFIG = {
  /**
   * Access token expiration time
   * Format: JWT time span (e.g., '1d', '2h', '30m', '60s')
   */
  ACCESS_EXPIRY: '1d',

  /**
   * Refresh token expiration time
   * Format: JWT time span (e.g., '7d', '30d')
   */
  REFRESH_EXPIRY: '7d',
} as const;

/**
 * File Upload Configuration
 * These are hardcoded application limits
 */
export const FILE_UPLOAD_CONFIG = {
  /**
   * Maximum file size in bytes
   * Default: 10MB (10 * 1024 * 1024 = 10485760 bytes)
   */
  MAX_FILE_SIZE: 10485760,

  /**
   * Maximum file size in megabytes (for display/documentation)
   */
  MAX_FILE_SIZE_MB: 10,

  /**
   * Upload directory path (relative to backend root)
   */
  UPLOAD_DIR: 'uploads',
} as const;

/**
 * Allowed file types for uploads
 */
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] as string[],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'] as string[],
  ARCHIVES: ['.zip', '.rar', '.7z', '.tar', '.gz'] as string[],
};

/**
 * Get all allowed file extensions as a flat array
 */
export const getAllowedExtensions = (): string[] => {
  return [
    ...ALLOWED_FILE_TYPES.IMAGES,
    ...ALLOWED_FILE_TYPES.DOCUMENTS,
    ...ALLOWED_FILE_TYPES.ARCHIVES,
  ];
};

/**
 * Check if a file extension is allowed
 * @param filename - The filename to check
 * @returns true if the file extension is allowed
 */
export const isAllowedFileType = (filename: string): boolean => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return getAllowedExtensions().includes(ext);
};

/**
 * Get file category based on extension
 * @param filename - The filename to categorize
 * @returns The category of the file
 */
export const getFileCategory = (
  filename: string,
): 'image' | 'document' | 'archive' | 'unknown' => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));

  if (ALLOWED_FILE_TYPES.IMAGES.includes(ext)) return 'image';
  if (ALLOWED_FILE_TYPES.DOCUMENTS.includes(ext)) return 'document';
  if (ALLOWED_FILE_TYPES.ARCHIVES.includes(ext)) return 'archive';

  return 'unknown';
};

/**
 * File upload error messages
 */
export const FILE_UPLOAD_ERRORS = {
  FILE_TOO_LARGE: `File size exceeds the maximum allowed size of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB`,
  INVALID_FILE_TYPE: `File type not allowed. Allowed types: ${getAllowedExtensions().join(', ')}`,
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  FILE_NOT_FOUND: 'File not found.',
  DELETE_FAILED: 'Failed to delete file.',
} as const;
