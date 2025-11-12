# Backend Authentication Module - Quick Reference

## File Locations (Quick Access)

```
apps/backend/src/modules/auth/
├── auth.controller.ts          # API endpoints
├── auth.service.ts             # Business logic
├── auth.module.ts              # Module config
├── dto/
│   └── change-password.dto.ts   # Change password DTO
├── strategies/
│   ├── jwt.strategy.ts          # JWT verification
│   └── local.strategy.ts        # Local auth
└── guards/
    ├── jwt-auth.guard.ts        # JWT auth guard
    ├── optional-jwt-auth.guard.ts
    └── roles.guard.ts           # Role-based access

apps/backend/src/modules/users/
└── users.service.ts            # User creation & password hashing

apps/backend/src/config/
└── jwt.config.ts               # JWT configuration (RSA keys)

packages/shared/src/types/
├── auth.types.ts               # Auth DTOs & interfaces
└── user.types.ts               # User types & enums
```

---

## API Endpoints Summary

| Endpoint | Method | Auth | Request | Response |
|----------|--------|------|---------|----------|
| `/api/auth/register` | POST | Public | RegisterDto | AuthResponse |
| `/api/auth/login` | POST | Public | LoginDto | AuthResponse |
| `/api/auth/refresh` | POST | Public | RefreshTokenDto | AuthResponse |
| `/api/auth/change-password` | PATCH | JWT | ChangePasswordDto | 200 OK |

---

## Key DTOs

### RegisterDto (5 fields)
```typescript
{
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date; // ISO 8601 format
}
```

### LoginDto (2 fields)
```typescript
{
  email: string;
  password: string;
}
```

### AuthResponse (Always returned after login/register)
```typescript
{
  accessToken: string;     // Expires in 1 day
  refreshToken: string;    // Expires in 7 days
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;       // 'ADMIN' | 'STAFF' | 'CUSTOMER'
  };
}
```

### ChangePasswordDto (2 fields)
```typescript
{
  currentPassword: string;  // Min 1 char
  newPassword: string;      // Min 8 chars
}
```

---

## User Roles

```typescript
enum UserRole {
  ADMIN = 'ADMIN',           // Full access
  STAFF = 'STAFF',           // Limited access
  CUSTOMER = 'CUSTOMER'      // Regular user (default)
}
```

Default role for new registrations: **CUSTOMER**

---

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Algorithm**: RS256 (RSA 4096-bit asymmetric encryption)
- **Access Token TTL**: 1 day
- **Refresh Token TTL**: 7 days
- **Token Verification**: Uses RSA public key
- **Token Structure**: `header.payload.signature`
- **JWT Payload**: `{ sub, email, role, iat, exp }`

---

## Common Implementation Patterns

### 1. Password Hashing (Backend)
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. Password Verification (Backend)
```typescript
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 3. Token Signing (Backend)
```typescript
const token = this.jwtService.sign(payload);
```

### 4. Token Verification (Backend)
```typescript
const payload = this.jwtService.verify(token, {
  publicKey: jwtConfig.publicKey,
  algorithms: ['RS256'],
  issuer: 'vinhxuan-cms',
  audience: 'vinhxuan-cms-users',
});
```

### 5. API Request with Auth (Frontend)
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### 6. Token Storage (Frontend)
```typescript
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', token);
```

---

## Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 401 | Invalid credentials | Wrong email/password |
| 401 | Invalid refresh token | Expired or malformed token |
| 401 | Current password is incorrect | Wrong current password |
| 400 | Bad request | Missing/invalid fields |
| 409 | Email already exists | Duplicate email |

---

## Response Format

### Success
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { }
}
```

### Error
```json
{
  "statusCode": 401,
  "message": "Error message",
  "data": null
}
```

---

## Field Validation Summary

### RegisterDto
- `fullName`: required, non-empty string
- `email`: required, valid email format, must be unique
- `password`: required, recommended min 8 chars (frontend), hashed on backend
- `phone`: required, valid phone format (Vietnamese)
- `dateOfBirth`: required, ISO 8601 date format (YYYY-MM-DD)

### LoginDto
- `email`: required, valid format, must exist in system
- `password`: required, compared with bcrypt hash

### ChangePasswordDto
- `currentPassword`: required, non-empty, must match user's current hash
- `newPassword`: required, minimum 8 characters

---

## Token Expiry Configuration

Environment variables (in `.env`):

```env
JWT_ACCESS_EXPIRY=1d          # Default: 1 day
JWT_REFRESH_EXPIRY=7d         # Default: 7 days
JWT_PRIVATE_KEY_PATH=...      # Path to private key
JWT_PUBLIC_KEY_PATH=...       # Path to public key
```

---

## JWT Key Generation (One-time Setup)

```bash
# Generate 4096-bit RSA private key
openssl genrsa -out apps/backend/keys/jwt-private.key 4096

# Extract public key from private key
openssl rsa -in apps/backend/keys/jwt-private.key -pubout -out apps/backend/keys/jwt-public.key
```

Keys must exist at:
- `apps/backend/keys/jwt-private.key`
- `apps/backend/keys/jwt-public.key`

Or configure paths via environment variables.

---

## User Creation Flow (Registration)

```
1. POST /api/auth/register with RegisterDto
2. Backend validates input
3. Hash password with bcrypt (salt=10)
4. Create User entity:
   - role: 'CUSTOMER' (default)
   - status: true (Active, default)
5. Save User to database
6. Create JWT payload: { sub, email, role }
7. Sign accessToken (1 day, RS256)
8. Sign refreshToken (7 days, RS256)
9. Return AuthResponse with both tokens
```

---

## Token Refresh Flow

```
1. POST /api/auth/refresh with RefreshTokenDto
2. Backend verifies refresh token using public key
3. Extract user ID from token payload
4. Fetch latest user info from database
5. Create new JWT payload
6. Sign new access token and refresh token
7. Return AuthResponse with new tokens
8. Client updates localStorage
```

---

## Frontend Integration Checklist

- [ ] Import DTOs from `@shared` types
- [ ] Create API service for auth endpoints
- [ ] Implement token storage (localStorage)
- [ ] Implement token refresh interceptor
- [ ] Create login page with RegisterDto fields
- [ ] Create register page with LoginDto fields
- [ ] Create protected route guard
- [ ] Handle token expiration (401 response)
- [ ] Handle navigation on auth/logout
- [ ] Display error messages appropriately
- [ ] Validate email format before submit
- [ ] Validate password length (min 8 chars)
- [ ] Support Vietnamese phone format
- [ ] Support ISO 8601 date format (YYYY-MM-DD)

---

## Backend Integration Checklist

- [ ] JWT keys generated and placed in `apps/backend/keys/`
- [ ] Auth module imported in app.module.ts
- [ ] JwtAuthGuard can be applied to controllers
- [ ] Roles decorator available for role-based access
- [ ] Password hashing working (bcrypt salt=10)
- [ ] Token verification working (RS256)
- [ ] Error handling returning correct status codes
- [ ] Response format consistent (statusCode, message, data)
- [ ] Users service creating employees for ADMIN/STAFF roles
- [ ] Change password endpoint protected by JWT

---

## Performance Considerations

- Token verification is fast (RSA public key operation)
- Password hashing takes time (bcrypt salt=10) - intentional for security
- Use interceptors to automatically add auth header
- Implement token refresh before expiration
- Cache user info in frontend state to avoid repeated API calls
- Implement logout endpoint to clear tokens on client-side

---

## Security Best Practices

1. Always use HTTPS in production
2. Store tokens in httpOnly cookies (more secure than localStorage)
3. Implement CSRF protection
4. Rotate RSA keys periodically
5. Never log passwords or tokens
6. Validate all input on backend
7. Use rate limiting for auth endpoints
8. Implement account lockout after failed attempts
9. Add email verification for new registrations
10. Support password reset functionality

---

## Troubleshooting

### "RSA keys not found" Error
- Generate keys using openssl commands
- Ensure keys are in `apps/backend/keys/` directory
- Check JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH env vars

### "Invalid credentials"
- Verify email exists in database
- Verify password matches user's bcrypt hash
- Check password isn't empty

### "Invalid refresh token"
- Verify refresh token hasn't expired (7 days)
- Verify refresh token signature is valid
- Check issuer and audience match configuration

### "Current password is incorrect"
- Verify bcrypt.compare() is working correctly
- Check password is hashed when stored

### Token not being sent in requests
- Verify Authorization header format: `Bearer {token}`
- Check token is stored correctly in localStorage
- Verify JwtAuthGuard is applied to controller

---

## Useful Commands

```bash
# Test login endpoint
curl -X POST http://localhost:8830/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint with token
curl -X GET http://localhost:8830/api/users \
  -H "Authorization: Bearer {accessToken}"

# Generate JWT keys
openssl genrsa -out apps/backend/keys/jwt-private.key 4096
openssl rsa -in apps/backend/keys/jwt-private.key -pubout -out apps/backend/keys/jwt-public.key

# View JWT token payload (online: https://jwt.io)
# or manually: base64 decode the payload section
```

---

## Additional Resources

- See `AUTH_EXPLORATION_SUMMARY.md` for detailed DTO and response definitions
- See `AUTH_CODE_STRUCTURE.md` for complete code snippets
- See `AUTH_FLOW_DIAGRAMS.md` for visual process flows

