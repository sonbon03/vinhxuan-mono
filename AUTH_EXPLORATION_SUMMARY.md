# Backend Authentication Module - Exploration Report

## Overview
The VinhXuan CMS uses a robust authentication system with RSA256 asymmetric encryption (JWT tokens). The implementation includes login, registration, token refresh, and password change functionality.

## 1. API Endpoints

### Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**: LoginDto
- **Response**: AuthResponse

### Register
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**: RegisterDto
- **Response**: AuthResponse

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Access**: Public
- **Request Body**: RefreshTokenDto
- **Response**: AuthResponse

### Change Password
- **Endpoint**: `PATCH /api/auth/change-password`
- **Access**: Authenticated (requires JWT)
- **Request Body**: ChangePasswordDto
- **Response**: void (204 No Content)

---

## 2. Data Transfer Objects (DTOs)

### LoginDto
Located in: `packages/shared/src/types/auth.types.ts`

```typescript
interface LoginDto {
  email: string;
  password: string;
}
```

**Fields**:
- `email` (string): User's email address
- `password` (string): User's password (plain text, hashed on backend)

**Validation** (backend):
- Email is validated against existing user
- Password is compared with bcrypt hash

---

### RegisterDto
Located in: `packages/shared/src/types/auth.types.ts`

```typescript
interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
}
```

**Fields**:
- `fullName` (string): User's full name
- `email` (string): User's email address (must be unique)
- `password` (string): User's password (minimum 8 characters recommended, hashed with bcrypt salt=10)
- `phone` (string): User's phone number (format validation recommended for Vietnamese format)
- `dateOfBirth` (Date): User's date of birth (ISO 8601 format)

**Default Values**:
- `role`: Defaults to 'CUSTOMER' (set by usersService.create)
- `status`: Defaults to true (Active)

**Backend Processing**:
- Password is hashed using bcrypt with 10 salt rounds
- If role is ADMIN or STAFF, an Employee record is automatically created
- If Employee creation fails, the User is rolled back (transaction-like behavior)

---

### RefreshTokenDto
Located in: `packages/shared/src/types/auth.types.ts`

```typescript
interface RefreshTokenDto {
  refreshToken: string;
}
```

**Fields**:
- `refreshToken` (string): JWT refresh token from previous login/registration

---

### ChangePasswordDto
Located in: `apps/backend/src/modules/auth/dto/change-password.dto.ts`

```typescript
class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
```

**Fields**:
- `currentPassword` (string): User's current password (for verification)
- `newPassword` (string): User's new password (minimum 8 characters)

**Validation Rules**:
- `currentPassword`: Required, must be non-empty string
- `newPassword`: Required, minimum 8 characters
- Backend verifies currentPassword matches user's stored hash before updating

---

## 3. Authentication Response Structure

### AuthResponse
Located in: `packages/shared/src/types/auth.types.ts`

```typescript
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
}
```

**Components**:

1. **accessToken** (string):
   - JWT token signed with RSA256 private key
   - Used for API authentication (Bearer token in Authorization header)
   - Expires in: 1 day (configurable via JWT_ACCESS_EXPIRY env var, default: '1d')
   - Algorithm: RS256 (RSA with SHA-256)

2. **refreshToken** (string):
   - JWT token signed with RSA256 private key
   - Longer-lived token for obtaining new access tokens
   - Expires in: 7 days (configurable via JWT_REFRESH_EXPIRY env var, default: '7d')
   - Algorithm: RS256 (RSA with SHA-256)

3. **user** (object):
   - `id`: User's UUID
   - `fullName`: User's full name
   - `email`: User's email address
   - `role`: User's role (ADMIN | STAFF | CUSTOMER)

---

## 4. JWT Token Details

### JWT Payload Structure
Located in: `packages/shared/src/types/auth.types.ts`

```typescript
interface JwtPayload {
  sub: string;       // user id
  userId: string;    // user id (duplicate for compatibility)
  email: string;
  role: UserRole;
  iat?: number;      // issued at (added automatically by JWT library)
  exp?: number;      // expiration (added based on expiresIn config)
}
```

### JWT Configuration
Located in: `apps/backend/src/config/jwt.config.ts`

**Access Token Config**:
```typescript
signOptions: {
  algorithm: 'RS256',
  expiresIn: '1d' (or process.env.JWT_ACCESS_EXPIRY)
  issuer: 'vinhxuan-cms',
  audience: 'vinhxuan-cms-users',
}

verifyOptions: {
  algorithms: ['RS256'],
  issuer: 'vinhxuan-cms',
  audience: 'vinhxuan-cms-users',
}
```

**Refresh Token Config**:
```typescript
signOptions: {
  algorithm: 'RS256',
  expiresIn: '7d' (or process.env.JWT_REFRESH_EXPIRY)
  issuer: 'vinhxuan-cms',
  audience: 'vinhxuan-cms-users',
}

verifyOptions: {
  algorithms: ['RS256'],
  issuer: 'vinhxuan-cms',
  audience: 'vinhxuan-cms-users',
}
```

### RSA Key Management
- **Private Key Path**: `apps/backend/keys/jwt-private.key` (or JWT_PRIVATE_KEY_PATH env var)
- **Public Key Path**: `apps/backend/keys/jwt-public.key` (or JWT_PUBLIC_KEY_PATH env var)
- **Key Size**: 4096-bit RSA keys
- **Generation Command**:
  ```bash
  openssl genrsa -out keys/jwt-private.key 4096
  openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key
  ```

---

## 5. User Roles

Located in: `packages/shared/src/types/user.types.ts`

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}
```

**Role Details**:
- **ADMIN**: Full system access, can create/manage users, approve content, view statistics
- **STAFF**: Limited access, can process records, manage consultations, create articles (for review)
- **CUSTOMER**: Regular user, can submit records, book consultations, publish listings

**Special Behavior**:
- When creating a user with ADMIN or STAFF role, an Employee record is automatically created
- Employee status is set to 'WORKING' by default
- Employee data includes position and years of experience

---

## 6. User Status

Located in: `packages/shared/src/types/user.types.ts`

```typescript
type UserStatus = boolean; // true = Active, false = Inactive
```

- **true (Active)**: User account is active and can login
- **false (Inactive)**: User account is disabled

---

## 7. Key Security Features

### RSA256 Asymmetric Encryption
- **Benefit**: More secure than symmetric HS256
- **How it works**:
  - Private key signs tokens (kept secure on server)
  - Public key verifies tokens (can be shared safely)
- **Advantages**:
  - Prevents token forgery even if public key is compromised
  - Supports distributed microservices
  - Industry standard for enterprise systems
  - Better key management and rotation

### Token Flow
1. User logs in with email/password
2. Backend validates credentials and generates tokens
3. Access token (1 day) and Refresh token (7 days) are returned
4. Client stores tokens (typically in localStorage or secure cookies)
5. For API requests, client includes access token in Authorization header
6. When access token expires, client uses refresh token to get new tokens
7. Backend verifies refresh token and generates fresh tokens

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Passwords are never stored in plain text
- bcrypt.compare() is used for validation during login
- New password is hashed before storage

---

## 8. Implementation Files

### Core Authentication Files
- **Auth Controller**: `apps/backend/src/modules/auth/auth.controller.ts`
- **Auth Service**: `apps/backend/src/modules/auth/auth.service.ts`
- **Auth Module**: `apps/backend/src/modules/auth/auth.module.ts`

### Strategies
- **JWT Strategy**: `apps/backend/src/modules/auth/strategies/jwt.strategy.ts`
- **Local Strategy**: `apps/backend/src/modules/auth/strategies/local.strategy.ts`

### Guards
- **JWT Auth Guard**: `apps/backend/src/modules/auth/guards/jwt-auth.guard.ts`
- **Optional JWT Guard**: `apps/backend/src/modules/auth/guards/optional-jwt-auth.guard.ts`
- **Roles Guard**: `apps/backend/src/modules/auth/guards/roles.guard.ts`

### Configuration
- **JWT Config**: `apps/backend/src/config/jwt.config.ts`

### Users Service
- **Users Service**: `apps/backend/src/modules/users/users.service.ts`
- Handles user creation, validation, and password hashing
- Automatically creates Employee records for ADMIN/STAFF users

---

## 9. API Request/Response Examples

### Register Request
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "phone": "+84912345678",
  "dateOfBirth": "1990-01-15"
}
```

### Register Response
```json
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Login Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Login Response
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Refresh Token Request
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token Response
```json
{
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Change Password Request
```json
{
  "currentPassword": "SecurePassword123",
  "newPassword": "NewSecurePassword456"
}
```

### Change Password Response
```json
{
  "statusCode": 200,
  "message": "Password changed successfully"
}
```

---

## 10. Validation Summary

### RegisterDto Validation
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| fullName | string | Yes | Non-empty |
| email | string | Yes | Valid email format, must be unique |
| password | string | Yes | Recommended minimum 8 characters (enforced on frontend) |
| phone | string | Yes | Valid phone format (Vietnamese) |
| dateOfBirth | Date | Yes | Valid ISO 8601 date format |

### LoginDto Validation
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| email | string | Yes | Valid email format, must exist in system |
| password | string | Yes | Must match user's password hash |

### ChangePasswordDto Validation
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| currentPassword | string | Yes | Non-empty, must match user's current password |
| newPassword | string | Yes | Minimum 8 characters |

---

## 11. Important Notes for Frontend Integration

1. **Token Storage**: Store accessToken and refreshToken securely (use httpOnly cookies or localStorage)
2. **Token Refresh**: Implement automatic token refresh before expiration or on 401 response
3. **Email Format**: Frontend should validate email format and prevent spaces
4. **Password Requirements**: Display to user that password should be at least 8 characters
5. **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for dateOfBirth
6. **Phone Format**: Support Vietnamese phone format (+84 or 0)
7. **Authorization Header**: Use format: `Authorization: Bearer {accessToken}`
8. **Error Handling**: 
   - 400: Invalid request data
   - 401: Unauthorized (invalid credentials or expired token)
   - 409: Email already exists (during registration)

