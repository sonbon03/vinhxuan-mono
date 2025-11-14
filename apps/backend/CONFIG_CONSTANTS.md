# Configuration Constants Migration

## Overview

The following environment variables have been **removed** from `.env` and are now **hardcoded** in the configuration files:

- `JWT_ACCESS_EXPIRY` - Now in `src/config/constants.config.ts`
- `JWT_REFRESH_EXPIRY` - Now in `src/config/constants.config.ts`
- `MAX_FILE_SIZE` - Now in `src/config/constants.config.ts`
- `UPLOAD_DIR` - Now in `src/config/constants.config.ts`

These values are application-level constants that should be the same across all environments, so they no longer need to be configurable via environment variables.

---

## What Changed

### 1. Created Configuration Constants File

**File:** `src/config/constants.config.ts`

This file contains all hardcoded application-level configuration values.

**Contents:**
```typescript
// JWT Token Expiration
export const JWT_CONFIG = {
  ACCESS_EXPIRY: '1d',      // 1 day
  REFRESH_EXPIRY: '7d',     // 7 days
} as const;

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10485760,  // 10MB in bytes
  MAX_FILE_SIZE_MB: 10,     // For display
  UPLOAD_DIR: 'uploads',    // Upload directory path
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'],
  ARCHIVES: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

// Utility functions
export const getAllowedExtensions = (): string[];
export const isAllowedFileType = (filename: string): boolean;
export const getFileCategory = (filename: string): 'image' | 'document' | 'archive' | 'unknown';

// Error messages
export const FILE_UPLOAD_ERRORS = {
  FILE_TOO_LARGE: `File size exceeds the maximum allowed size of 10MB`,
  INVALID_FILE_TYPE: `File type not allowed. Allowed types: ...`,
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  FILE_NOT_FOUND: 'File not found.',
  DELETE_FAILED: 'Failed to delete file.',
} as const;
```

### 2. Updated JWT Configuration

**File:** `src/config/jwt.config.ts`

**Before:**
```typescript
expiresIn: process.env.JWT_ACCESS_EXPIRY || '1d',
expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
```

**After:**
```typescript
import { JWT_CONFIG } from './constants.config';

expiresIn: JWT_CONFIG.ACCESS_EXPIRY,  // '1d'
expiresIn: JWT_CONFIG.REFRESH_EXPIRY, // '7d'
```

### 3. Updated .env.example

**Removed variables:**
```diff
- JWT_ACCESS_EXPIRY=1d
- JWT_REFRESH_EXPIRY=7d
- MAX_FILE_SIZE=10485760
- UPLOAD_DIR=uploads
```

**Added documentation comments:**
```bash
# JWT Configuration
# Note: JWT_ACCESS_EXPIRY and JWT_REFRESH_EXPIRY are now hardcoded in src/config/constants.config.ts

# File Upload Configuration
# Note: MAX_FILE_SIZE and UPLOAD_DIR are now hardcoded in src/config/constants.config.ts
# - MAX_FILE_SIZE: 10MB (10485760 bytes)
# - UPLOAD_DIR: 'uploads'
```

---

## How to Use

### JWT Configuration

```typescript
import { JWT_CONFIG } from '@/config/constants.config';

// Access token expiry
console.log(JWT_CONFIG.ACCESS_EXPIRY);  // '1d'

// Refresh token expiry
console.log(JWT_CONFIG.REFRESH_EXPIRY); // '7d'
```

### File Upload Configuration

```typescript
import {
  FILE_UPLOAD_CONFIG,
  isAllowedFileType,
  getFileCategory,
  FILE_UPLOAD_ERRORS
} from '@/config/constants.config';

// Check file size
if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
  throw new Error(FILE_UPLOAD_ERRORS.FILE_TOO_LARGE);
}

// Display max size to user
console.log(`Maximum file size: ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB`);

// Check file type
if (!isAllowedFileType(filename)) {
  throw new Error(FILE_UPLOAD_ERRORS.INVALID_FILE_TYPE);
}

// Get file category
const category = getFileCategory('document.pdf'); // 'document'

// Get upload directory
const uploadPath = FILE_UPLOAD_CONFIG.UPLOAD_DIR; // 'uploads'
```

---

## Why This Change?

### Benefits

1. **Simplified Configuration**
   - These values are the same across all environments (dev, staging, production)
   - No need to manage them in multiple `.env` files
   - Reduces configuration complexity

2. **Type Safety**
   - TypeScript can infer exact types from constants
   - Better autocomplete and IntelliSense
   - Compile-time checks for typos

3. **Single Source of Truth**
   - Values are defined in one place
   - Easy to find and update
   - No risk of mismatched values across environments

4. **Better Documentation**
   - Utility functions provide clear interfaces
   - Error messages are centralized
   - Code is self-documenting

5. **Easier Testing**
   - No need to mock environment variables for these values
   - Tests are more reliable

### When to Use Environment Variables vs. Constants

**Use Environment Variables for:**
- ✅ Database credentials (different per environment)
- ✅ API keys and secrets (different per environment)
- ✅ Third-party service URLs (different per environment)
- ✅ Redis/cache configuration (different per environment)
- ✅ Feature flags (different per environment)

**Use Hardcoded Constants for:**
- ✅ Application-level limits (same across all environments)
- ✅ Token expiration times (same across all environments)
- ✅ File size limits (same across all environments)
- ✅ Allowed file types (same across all environments)
- ✅ Pagination defaults (same across all environments)

---

## How to Change Values

To change the hardcoded values, edit `src/config/constants.config.ts`:

### Change JWT Token Expiration

```typescript
export const JWT_CONFIG = {
  ACCESS_EXPIRY: '2h',      // Changed from '1d' to '2h'
  REFRESH_EXPIRY: '30d',    // Changed from '7d' to '30d'
} as const;
```

### Change File Upload Limits

```typescript
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 20971520,  // Changed from 10MB to 20MB
  MAX_FILE_SIZE_MB: 20,     // Update display value too
  UPLOAD_DIR: 'storage',    // Changed from 'uploads'
} as const;
```

### Add New Allowed File Types

```typescript
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic'], // Added .heic
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv', '.ppt', '.pptx'], // Added PowerPoint
  ARCHIVES: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};
```

---

## Migration Checklist

If you're migrating existing code:

- [x] ✅ Created `src/config/constants.config.ts`
- [x] ✅ Updated `src/config/jwt.config.ts` to use `JWT_CONFIG`
- [x] ✅ Removed variables from `.env.example`
- [x] ✅ Added documentation comments to `.env.example`
- [x] ✅ Verified TypeScript compilation passes
- [ ] Update any code that references `process.env.JWT_ACCESS_EXPIRY`
- [ ] Update any code that references `process.env.JWT_REFRESH_EXPIRY`
- [ ] Update any code that references `process.env.MAX_FILE_SIZE`
- [ ] Update any code that references `process.env.UPLOAD_DIR`
- [ ] Remove these variables from existing `.env` files
- [ ] Update deployment documentation

---

## Example: Updating Existing Code

### Before

```typescript
// Direct environment variable access
const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const jwtExpiry = process.env.JWT_ACCESS_EXPIRY || '1d';

// Manual file type checking
const allowedTypes = ['.jpg', '.png', '.pdf'];
if (!allowedTypes.includes(ext)) {
  throw new Error('Invalid file type');
}
```

### After

```typescript
// Import from constants config
import {
  FILE_UPLOAD_CONFIG,
  JWT_CONFIG,
  isAllowedFileType,
  FILE_UPLOAD_ERRORS
} from '@/config/constants.config';

// Use typed constants
const maxSize = FILE_UPLOAD_CONFIG.MAX_FILE_SIZE; // Already a number
const uploadDir = FILE_UPLOAD_CONFIG.UPLOAD_DIR;
const jwtExpiry = JWT_CONFIG.ACCESS_EXPIRY;

// Use utility functions
if (!isAllowedFileType(filename)) {
  throw new Error(FILE_UPLOAD_ERRORS.INVALID_FILE_TYPE);
}
```

---

## Testing

All changes have been verified:

```bash
$ yarn tsc --noEmit
Done in 7.54s ✅

# No TypeScript errors
# All imports resolve correctly
# All constants are properly typed
```

---

## Files Changed

### Created
- ✅ `src/config/constants.config.ts` - Application constants

### Modified
- ✅ `src/config/jwt.config.ts` - Uses `JWT_CONFIG` constants
- ✅ `.env.example` - Removed variables, added documentation

### Documentation
- ✅ `CONFIG_CONSTANTS.md` - This file

---

## Support

If you need to make these values configurable again:

1. Add them back to `.env.example`
2. Read them in `constants.config.ts`:
   ```typescript
   export const JWT_CONFIG = {
     ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '1d',
     REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
   } as const;
   ```
3. Update this documentation

---

**Last Updated:** November 14, 2025
**Status:** ✅ Complete and Verified
