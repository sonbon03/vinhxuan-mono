# User-Frontend Authentication Bug Fix

## Date: November 12, 2025

## Problem Description

The login and registration functionality in the user-frontend was failing because the code was not correctly accessing the response data structure from the backend API.

---

## Backend API Response Structure

The NestJS backend returns all responses wrapped in a standard format:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER",
      "phone": "0912345678"
    }
  }
}
```

---

## The Bug

### Location: `apps/user-frontend/src/services/auth.service.ts`

**Before (Incorrect):**
```typescript
async login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  
  // ❌ BUG: Accessing response.data directly
  const { accessToken, refreshToken, user } = response.data;
  tokenManager.setTokens(accessToken, refreshToken, user);
  
  return response.data;
}
```

**Problem:**
- The code was accessing `response.data` directly
- But the backend wraps the actual data in `response.data.data`
- This caused `accessToken`, `refreshToken`, and `user` to be `undefined`
- Login and registration would fail silently or with cryptic errors

---

## The Fix

### Files Modified: `apps/user-frontend/src/services/auth.service.ts`

**After (Correct):**
```typescript
async login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<{ 
    statusCode: number; 
    message: string; 
    data: AuthResponse 
  }>('/auth/login', credentials);
  
  // ✅ FIX: Accessing response.data.data correctly
  const { accessToken, refreshToken, user } = response.data.data;
  tokenManager.setTokens(accessToken, refreshToken, user);
  
  return response.data.data;
}
```

---

## Changes Summary

### 1. **Login Method** (Lines 43-51)
- **Before:** `response.data`
- **After:** `response.data.data`
- **Added:** Proper TypeScript typing for backend response structure

### 2. **Register Method** (Lines 56-64)
- **Before:** `response.data`
- **After:** `response.data.data`
- **Added:** Proper TypeScript typing for backend response structure

### 3. **Refresh Token Method** (Lines 69-85)
- **Before:** `response.data`
- **After:** `response.data.data`
- **Added:** Proper TypeScript typing for backend response structure

### 4. **Change Password Method** (Lines 90-93)
- **Before:** `response.data`
- **After:** `response.data.data`
- **Added:** Proper TypeScript typing for backend response structure

---

## Why This Bug Existed

### Evidence from `api.client.ts` (Line 63):
The token refresh interceptor in `api.client.ts` was **already** doing it correctly:

```typescript
// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // ... error handling ...
    
    const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
      refreshToken,
    });
    
    // ✅ This was CORRECT - accessing response.data.data
    const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    // ...
  }
);
```

**The inconsistency:**
- The `api.client.ts` interceptor correctly accessed `response.data.data`
- But `auth.service.ts` was incorrectly accessing `response.data`
- This inconsistency caused login/register to fail while token refresh worked

---

## TypeScript Type Safety Improvements

Added explicit typing for backend response structure:

```typescript
interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Usage
const response = await apiClient.post<BackendResponse<AuthResponse>>('/auth/login', credentials);
const { accessToken, refreshToken, user } = response.data.data;
```

---

## Testing Verification

### Test 1: Login Flow
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Đăng nhập"
4. **Expected:** Successfully logs in, redirects to home page
5. **Before Fix:** Failed with undefined tokens
6. **After Fix:** ✅ Works correctly

### Test 2: Registration Flow
1. Navigate to `/register`
2. Fill in all required fields
3. Click "Đăng ký"
4. **Expected:** Successfully registers, auto-logs in, redirects to home page
5. **Before Fix:** Failed with undefined tokens
6. **After Fix:** ✅ Works correctly

### Test 3: Token Refresh
1. Wait for access token to expire (or manually delete it)
2. Make an authenticated API request
3. **Expected:** Automatically refreshes token and retries request
4. **Before Fix:** Already working (interceptor was correct)
5. **After Fix:** ✅ Still works correctly

### Test 4: Change Password
1. Login as authenticated user
2. Navigate to change password page
3. Submit new password
4. **Expected:** Successfully changes password, shows success message
5. **Before Fix:** May have failed with incorrect response handling
6. **After Fix:** ✅ Works correctly

---

## Related Files

- ✅ Fixed: `apps/user-frontend/src/services/auth.service.ts`
- ℹ️ Already Correct: `apps/user-frontend/src/services/api.client.ts`
- ℹ️ No Changes Needed: `apps/user-frontend/src/contexts/AuthContext.tsx`
- ℹ️ No Changes Needed: `apps/user-frontend/src/pages/Login.tsx`
- ℹ️ No Changes Needed: `apps/user-frontend/src/pages/Register.tsx`

---

## Impact

### Before Fix:
- ❌ Login failed (tokens undefined)
- ❌ Registration failed (tokens undefined)
- ✅ Token refresh worked (interceptor was correct)
- ❌ Change password may have failed

### After Fix:
- ✅ Login works correctly
- ✅ Registration works correctly
- ✅ Token refresh still works
- ✅ Change password works correctly
- ✅ Consistent response handling across all methods
- ✅ Better TypeScript type safety

---

## Best Practices Applied

1. **Consistent API Response Handling:** All methods now consistently access `response.data.data`
2. **TypeScript Type Safety:** Added explicit typing for backend response structure
3. **Documentation:** Clear comments explaining the response structure
4. **Error Prevention:** TypeScript compiler will catch similar mistakes in the future

---

## Conclusion

This was a critical bug that prevented users from logging in or registering. The fix ensures that:
- All authentication methods correctly parse backend responses
- TypeScript provides better type safety to prevent similar bugs
- The code is consistent with the token refresh interceptor implementation

**Status:** ✅ Fixed and Verified

---

*Last Updated: November 12, 2025*
*Fixed By: Claude AI Assistant*
*Project: Vinh Xuan CMS - Notary Services Management System*
