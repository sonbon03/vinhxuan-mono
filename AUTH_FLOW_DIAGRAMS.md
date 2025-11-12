# Backend Authentication Module - Flow Diagrams

## 1. Login Flow

```
┌──────────────┐                                  ┌──────────────┐
│   Frontend   │                                  │   Backend    │
└────┬─────────┘                                  └────┬─────────┘
     │                                                  │
     │ 1. POST /api/auth/login                        │
     │ { email, password }                            │
     ├─────────────────────────────────────────────────>
     │                                                  │
     │                                             2. Find user
     │                                             by email
     │                                                  │
     │                                             3. Compare
     │                                             password with
     │                                             bcrypt hash
     │                                                  │
     │                                             4. Create JWT
     │                                             payload:
     │                                             - sub (user id)
     │                                             - email
     │                                             - role
     │                                                  │
     │                                             5. Sign tokens:
     │                                             - accessToken
     │                                               (1 day, RS256)
     │                                             - refreshToken
     │                                               (7 days, RS256)
     │                                                  │
     │ 6. Response: AuthResponse                      │
     │ { accessToken,                                  │
     │   refreshToken,                                │
     │   user: { id, fullName, email, role } }        │
     │<─────────────────────────────────────────────────┤
     │                                                  │
     │ 7. Store tokens in localStorage                │
     │ 8. Store user info in state/store              │
     │                                                  │
```

---

## 2. Registration Flow

```
┌──────────────┐                                  ┌──────────────┐
│   Frontend   │                                  │   Backend    │
└────┬─────────┘                                  └────┬─────────┘
     │                                                  │
     │ 1. POST /api/auth/register                     │
     │ { fullName, email, password, phone,            │
     │   dateOfBirth }                                │
     ├─────────────────────────────────────────────────>
     │                                                  │
     │                                             2. Hash password
     │                                             with bcrypt
     │                                             (salt = 10)
     │                                                  │
     │                                             3. Create User
     │                                             entity with:
     │                                             - fullName
     │                                             - email
     │                                             - hashedPassword
     │                                             - phone
     │                                             - dateOfBirth
     │                                             - role: CUSTOMER
     │                                             - status: true
     │                                                  │
     │                                             4. Save to DB
     │                                                  │
     │                                             5. Create JWT
     │                                             payload and
     │                                             sign tokens
     │                                                  │
     │ 6. Response: AuthResponse                      │
     │ { accessToken,                                  │
     │   refreshToken,                                │
     │   user: { id, fullName, email,                 │
     │           role: CUSTOMER } }                   │
     │<─────────────────────────────────────────────────┤
     │                                                  │
     │ 7. Store tokens and redirect to                │
     │    dashboard/home                              │
     │                                                  │
```

---

## 3. Token Refresh Flow

```
┌──────────────┐                                  ┌──────────────┐
│   Frontend   │                                  │   Backend    │
└────┬─────────┘                                  └────┬─────────┘
     │                                                  │
     │ Access token expires (401 response)            │
     │                                                  │
     │ 1. POST /api/auth/refresh                      │
     │ { refreshToken }                               │
     ├─────────────────────────────────────────────────>
     │                                                  │
     │                                             2. Verify refresh
     │                                             token using
     │                                             RSA public key
     │                                                  │
     │                                             3. Extract user ID
     │                                             from token
     │                                                  │
     │                                             4. Fetch updated
     │                                             user info from DB
     │                                                  │
     │                                             5. Create new
     │                                             JWT payload
     │                                                  │
     │                                             6. Sign new tokens
     │                                             (both access and
     │                                             refresh)
     │                                                  │
     │ 7. Response: AuthResponse                      │
     │ { accessToken (new),                           │
     │   refreshToken (new),                          │
     │   user: { ... } }                              │
     │<─────────────────────────────────────────────────┤
     │                                                  │
     │ 8. Update tokens in localStorage               │
     │ 9. Retry original failed request               │
     │    with new accessToken                        │
     │                                                  │
```

---

## 4. API Request with JWT Token

```
┌──────────────┐                                  ┌──────────────┐
│   Frontend   │                                  │   Backend    │
└────┬─────────┘                                  └────┬─────────┘
     │                                                  │
     │ 1. GET /api/users                              │
     │ Headers: {                                      │
     │   Authorization: Bearer {accessToken}          │
     │ }                                               │
     ├─────────────────────────────────────────────────>
     │                                                  │
     │                                             2. Extract token
     │                                             from Authorization
     │                                             header
     │                                                  │
     │                                             3. Verify token
     │                                             using RSA public
     │                                             key
     │                                                  │
     │                                             4. Validate:
     │                                             - Signature
     │                                             - Expiration
     │                                             - Issuer
     │                                             - Audience
     │                                                  │
     │                                             5. Extract payload
     │                                             (sub, email, role)
     │                                                  │
     │                                             6. Attach to
     │                                             request object
     │                                             (req.user)
     │                                                  │
     │                                             7. Execute API
     │                                             logic
     │                                                  │
     │ 8. Response: API Data                          │
     │<─────────────────────────────────────────────────┤
     │                                                  │
```

---

## 5. Password Change Flow

```
┌──────────────┐                                  ┌──────────────┐
│   Frontend   │                                  │   Backend    │
└────┬─────────┘                                  └────┬─────────┘
     │                                                  │
     │ 1. PATCH /api/auth/change-password             │
     │ Headers: { Authorization: Bearer {...} }       │
     │ Body: {                                         │
     │   currentPassword,                             │
     │   newPassword                                  │
     │ }                                               │
     ├─────────────────────────────────────────────────>
     │                                                  │
     │                                             2. Verify JWT
     │                                             token
     │                                                  │
     │                                             3. Fetch user
     │                                             from database
     │                                                  │
     │                                             4. Compare
     │                                             currentPassword
     │                                             with stored hash
     │                                             using bcrypt
     │                                                  │
     │                          If password doesn't match:
     │                          -> Throw UnauthorizedException
     │                          -> Return 401 error
     │                                                  │
     │                                             5. Hash new
     │                                             password with
     │                                             bcrypt
     │                                                  │
     │                                             6. Update user
     │                                             with new
     │                                             password hash
     │                                                  │
     │ 7. Response: 200 OK                            │
     │<─────────────────────────────────────────────────┤
     │                                                  │
     │ 8. Show success message to user                │
     │ 9. Optionally redirect to login                │
     │                                                  │
```

---

## 6. JWT Token Structure (Decoded)

```
Header (RS256):
{
  "alg": "RS256",
  "typ": "JWT"
}

Payload (AuthResponse user will receive):
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user id
  "userId": "550e8400-e29b-41d4-a716-446655440000", // duplicate
  "email": "user@example.com",
  "role": "CUSTOMER",
  "iat": 1699782000,   // issued at (timestamp)
  "exp": 1699868400,   // expiration (timestamp)
  "iss": "vinhxuan-cms",
  "aud": "vinhxuan-cms-users"
}

Signature (RSA256 - created with private key):
RSASHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  privateKey
)

Full Token Format:
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVk9NRVIiLCJpYXQiOjE2OTk3ODIwMDAsImV4cCI6MTY5OTg2ODQwMCwiaXNzIjoidmluaHh1YW4tY21zIiwiYXVkIjoidmluaHh1YW4tY21zLXVzZXJzIn0
.
[SIGNATURE_CREATED_WITH_PRIVATE_KEY]
```

---

## 7. Error Handling Flows

### Login Error - Invalid Credentials
```
POST /api/auth/login
{ email: "user@example.com", password: "wrongpass" }
                                ↓
                    User not found OR
                    Password hash doesn't match
                                ↓
                    throw UnauthorizedException
                    ('Invalid credentials')
                                ↓
Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "data": null
}
```

### Refresh Token Error - Expired/Invalid Token
```
POST /api/auth/refresh
{ refreshToken: "invalid_or_expired_token" }
                                ↓
                    jwtService.verify() fails
                    (signature mismatch OR expired)
                                ↓
                    throw UnauthorizedException
                    ('Invalid refresh token')
                                ↓
Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "data": null
}
```

### Change Password Error - Wrong Current Password
```
PATCH /api/auth/change-password
{
  "currentPassword": "wrongpass",
  "newPassword": "newpass123"
}
                                ↓
                    bcrypt.compare() fails
                                ↓
                    throw UnauthorizedException
                    ('Current password is incorrect')
                                ↓
Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "data": null
}
```

---

## 8. User Creation on Registration

```
usersService.create(registerDto)
        ↓
1. Hash password with bcrypt (salt=10)
        ↓
2. Create User entity with:
   - fullName: registerDto.fullName
   - email: registerDto.email
   - password: hashedPassword
   - phone: registerDto.phone
   - dateOfBirth: registerDto.dateOfBirth
   - role: CUSTOMER (default)
   - status: true (Active, default)
        ↓
3. Save User to database
        ↓
4. Check if role is ADMIN or STAFF
   (It won't be, since default is CUSTOMER)
        ↓
5. Return saved User entity
        ↓
(If role was ADMIN/STAFF:
 - Automatically create Employee record
 - If Employee creation fails, rollback User)
```

---

## 9. Token Storage & Usage (Frontend)

```
After successful login/register:

1. Store in localStorage:
   localStorage.setItem('accessToken', response.data.accessToken)
   localStorage.setItem('refreshToken', response.data.refreshToken)
   localStorage.setItem('user', JSON.stringify(response.data.user))

For every API request:

2. Retrieve from localStorage:
   const accessToken = localStorage.getItem('accessToken')

3. Add to request headers:
   headers: {
     'Authorization': `Bearer ${accessToken}`
   }

4. On 401 response:
   const refreshToken = localStorage.getItem('refreshToken')
   POST /api/auth/refresh { refreshToken }
        ↓
   Update tokens:
   localStorage.setItem('accessToken', response.data.accessToken)
   localStorage.setItem('refreshToken', response.data.refreshToken)
        ↓
   Retry original request with new accessToken

5. On logout:
   localStorage.removeItem('accessToken')
   localStorage.removeItem('refreshToken')
   localStorage.removeItem('user')
   Redirect to login page
```

---

## 10. JWT Verification Process (Backend)

```
Incoming Request with Authorization header:
GET /api/users
Headers: { Authorization: "Bearer eyJhbGci..." }
                                ↓
1. JwtStrategy extracts token from "Bearer " prefix
                                ↓
2. ExtractJwt.fromAuthHeaderAsBearerToken()
   -> "eyJhbGci..."
                                ↓
3. jwtService.verify() is called with:
   - token: "eyJhbGci..."
   - publicKey: RSA_PUBLIC_KEY
   - algorithms: ['RS256']
   - issuer: 'vinhxuan-cms'
   - audience: 'vinhxuan-cms-users'
                                ↓
4. Passport verifies:
   ✓ Signature (using RSA public key)
   ✓ Expiration (exp claim)
   ✓ Issuer (iss claim)
   ✓ Audience (aud claim)
   ✓ Algorithm matches RS256
                                ↓
5. If all checks pass:
   -> Extract payload: { sub, email, role, ... }
   -> Pass to JwtStrategy.validate()
   -> Returns: { userId: sub, email, role }
   -> Attached to req.user
                                ↓
6. Controller/Service can access:
   req.user.userId
   req.user.email
   req.user.role
                                ↓
7. If any check fails:
   -> Throw UnauthorizedException
   -> Response: 401 Unauthorized
```

---

## Key Security Implementation Details

### RSA256 Asymmetric Encryption
```
Sign (Backend - Secure):
1. Private key is read from file at startup
2. Kept in memory on server only
3. Never transmitted or exposed
4. Used ONLY to sign tokens

         token_data
            ↓
        [RSA SIGN]
         (private key)
            ↓
        signature

Verify (Frontend/Other Services - Safe):
1. Public key can be shared safely
2. Used to verify tokens
3. Cannot forge tokens without private key
4. Can be in public repositories

    token + signature
            ↓
        [RSA VERIFY]
         (public key)
            ↓
     Authentic? ✓ or ✗
```

---

## Response Format (All Endpoints)

```typescript
// Success
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response payload
  }
}

// Error
{
  "statusCode": 401,  // or 400, 403, 404, 500, etc.
  "message": "Error message",
  "data": null
}
```

