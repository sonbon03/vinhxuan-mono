# Backend Authentication Module - Documentation Index

## Overview

This documentation provides a comprehensive exploration of the VinhXuan CMS backend authentication module. The system implements enterprise-grade security with RSA256 JWT tokens, bcrypt password hashing, and role-based access control.

## Documentation Files

### 1. AUTH_QUICK_REFERENCE.md
**Size**: 9.7 KB  
**Best For**: Quick lookups and implementation tasks  
**Contents**:
- Quick file locations reference
- API endpoints summary table
- Key DTOs with examples
- User roles and permissions
- Security features overview
- Common code patterns
- Error responses and status codes
- Field validation summary
- Frontend/Backend integration checklists
- Troubleshooting guide
- Useful commands

**Start here if**: You need quick answers or are actively implementing features

---

### 2. AUTH_EXPLORATION_SUMMARY.md
**Size**: 12 KB  
**Best For**: Understanding complete specifications and architecture  
**Contents**:
- Overview of all 4 API endpoints
- Detailed DTO specifications with validation rules
- AuthResponse structure and components
- JWT token details and RSA256 implementation
- User roles and permissions definitions
- Key security features explanation
- RSA key management and configuration
- Complete implementation files reference
- Request/response examples for all endpoints
- Frontend integration notes

**Start here if**: You need deep understanding of how authentication works

---

### 3. AUTH_CODE_STRUCTURE.md
**Size**: 13 KB  
**Best For**: Implementation reference and code examples  
**Contents**:
- Complete DTO definitions (shared types)
- Controller endpoint implementations
- Service methods with detailed comments
- Login flow implementation
- Registration flow implementation
- Token refresh flow implementation
- Password validation and change logic
- User creation with bcrypt hashing
- JWT strategy for token verification
- JWT configuration with RSA keys
- Module setup example
- Field definition reference tables

**Start here if**: You're writing code and need implementation examples

---

### 4. AUTH_FLOW_DIAGRAMS.md
**Size**: 20 KB  
**Best For**: Visual understanding of processes  
**Contents**:
- Login flow diagram (ASCII)
- Registration flow diagram
- Token refresh flow diagram
- API request with JWT authentication flow
- Password change flow diagram
- JWT token structure (decoded)
- Error handling flows
- User creation process flow
- Token storage and usage (frontend)
- JWT verification process (backend)
- RSA256 asymmetric encryption explanation
- Response format reference

**Start here if**: You learn better with visual diagrams and process flows

---

## Quick Navigation

### I want to understand...

**How login works**
- See: AUTH_FLOW_DIAGRAMS.md → Section 1 (Login Flow)
- Then: AUTH_CODE_STRUCTURE.md → Section 3 (Service - Login Flow)

**How registration works**
- See: AUTH_FLOW_DIAGRAMS.md → Section 2 (Registration Flow)
- Then: AUTH_CODE_STRUCTURE.md → Section 4 (Service - Register Flow)

**How tokens are refreshed**
- See: AUTH_FLOW_DIAGRAMS.md → Section 3 (Token Refresh Flow)
- Then: AUTH_CODE_STRUCTURE.md → Section 5 (Service - Token Refresh Flow)

**The DTO structures**
- See: AUTH_QUICK_REFERENCE.md → Key DTOs section
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 2 (DTOs)
- Code: AUTH_CODE_STRUCTURE.md → Section 1 (DTOs)

**The API endpoints**
- See: AUTH_QUICK_REFERENCE.md → API Endpoints Summary
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 1 (API Endpoints)

**Security implementation**
- See: AUTH_QUICK_REFERENCE.md → Security Features
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 7 (Security Features)
- Diagrams: AUTH_FLOW_DIAGRAMS.md → Section 12 (RSA256 Explanation)

**JWT token structure**
- See: AUTH_FLOW_DIAGRAMS.md → Section 6 (JWT Token Structure)
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 4 (JWT Token Details)

**User roles and permissions**
- See: AUTH_QUICK_REFERENCE.md → User Roles
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 5 (User Roles)

**Error handling**
- See: AUTH_QUICK_REFERENCE.md → Error Responses
- Flows: AUTH_FLOW_DIAGRAMS.md → Section 7 (Error Handling Flows)
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 9 (API Examples)

**How to implement in frontend**
- See: AUTH_QUICK_REFERENCE.md → Frontend Integration Checklist
- Patterns: AUTH_QUICK_REFERENCE.md → Common Implementation Patterns
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 11 (Frontend Integration Notes)

**How to implement in backend**
- See: AUTH_QUICK_REFERENCE.md → Backend Integration Checklist
- Code: AUTH_CODE_STRUCTURE.md → All sections
- Details: AUTH_EXPLORATION_SUMMARY.md → Section 8 (Implementation Files)

**Troubleshooting issues**
- See: AUTH_QUICK_REFERENCE.md → Troubleshooting section
- Flows: AUTH_FLOW_DIAGRAMS.md → Section 7 (Error Handling)

---

## Key Information at a Glance

### API Endpoints
- POST /api/auth/register - Public
- POST /api/auth/login - Public
- POST /api/auth/refresh - Public
- PATCH /api/auth/change-password - JWT Protected

### DTOs
- **RegisterDto**: fullName, email, password, phone, dateOfBirth
- **LoginDto**: email, password
- **AuthResponse**: accessToken, refreshToken, user { id, fullName, email, role }
- **ChangePasswordDto**: currentPassword, newPassword

### Security
- Password Hashing: bcrypt (salt rounds = 10)
- Token Algorithm: RS256 (RSA 4096-bit)
- Access Token TTL: 1 day
- Refresh Token TTL: 7 days
- Token Verification: RSA public key

### User Roles
- ADMIN: Full system access
- STAFF: Limited access (process records, create articles for review)
- CUSTOMER: Regular users (default for registration)

### Default Values
- User Role: CUSTOMER
- User Status: Active (true)
- Employee Status: WORKING

---

## Implementation Checklists

### Frontend Implementation Checklist
From AUTH_QUICK_REFERENCE.md:
- [ ] Import DTOs from @shared types
- [ ] Create API service for auth endpoints
- [ ] Implement token storage (localStorage)
- [ ] Implement token refresh interceptor
- [ ] Create login page form
- [ ] Create register page form
- [ ] Create protected route guard
- [ ] Handle token expiration (401 response)
- [ ] Handle navigation on auth/logout
- [ ] Display error messages appropriately
- [ ] Validate email format before submit
- [ ] Validate password length (min 8 chars)
- [ ] Support Vietnamese phone format
- [ ] Support ISO 8601 date format (YYYY-MM-DD)

### Backend Implementation Checklist
From AUTH_QUICK_REFERENCE.md:
- [ ] JWT keys generated and placed in apps/backend/keys/
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

## File Locations

Source code files explored:
```
apps/backend/src/modules/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
├── dto/change-password.dto.ts
├── strategies/jwt.strategy.ts
├── strategies/local.strategy.ts
└── guards/*

apps/backend/src/modules/users/
└── users.service.ts

apps/backend/src/config/
└── jwt.config.ts

packages/shared/src/types/
├── auth.types.ts
└── user.types.ts
```

---

## Common Tasks

### Generate JWT Keys (One-time Setup)
From AUTH_QUICK_REFERENCE.md:
```bash
openssl genrsa -out apps/backend/keys/jwt-private.key 4096
openssl rsa -in apps/backend/keys/jwt-private.key -pubout -out apps/backend/keys/jwt-public.key
```

### Test Login Endpoint
From AUTH_QUICK_REFERENCE.md:
```bash
curl -X POST http://localhost:8830/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Protected Endpoint
From AUTH_QUICK_REFERENCE.md:
```bash
curl -X GET http://localhost:8830/api/users \
  -H "Authorization: Bearer {accessToken}"
```

---

## Documentation Statistics

| Document | Size | Sections | Examples |
|----------|------|----------|----------|
| AUTH_QUICK_REFERENCE.md | 9.7 KB | 15+ | Implementation patterns |
| AUTH_EXPLORATION_SUMMARY.md | 12 KB | 11 | Request/response examples |
| AUTH_CODE_STRUCTURE.md | 13 KB | 11 | Complete code snippets |
| AUTH_FLOW_DIAGRAMS.md | 20 KB | 12 | ASCII diagrams |
| **Total** | **~54 KB** | **49+** | **Comprehensive** |

---

## How to Use This Documentation

1. **First Time Learning**: Start with AUTH_FLOW_DIAGRAMS.md to understand the big picture visually
2. **Deep Dive**: Read AUTH_EXPLORATION_SUMMARY.md for complete specifications
3. **Implementation**: Use AUTH_CODE_STRUCTURE.md as reference while coding
4. **Quick Lookup**: Use AUTH_QUICK_REFERENCE.md during development

---

## Additional Resources

- Project PRD: See CLAUDE.md in project root for complete project requirements
- Backend Details: See Section VIII (Core Responsibilities) in CLAUDE.md for implementation guidelines
- API Documentation: Swagger/OpenAPI available at /api/docs when backend is running
- Database Schema: See apps/backend/src/database/ for migrations and schema

---

## Key Insights

1. **Security First**: RSA256 provides enterprise-grade security
2. **Password Protection**: bcrypt with 10 rounds ensures secure storage
3. **Token Rotation**: Refresh token mechanism prevents long-term token usage
4. **Role-Based Access**: Three-tier role system (ADMIN, STAFF, CUSTOMER)
5. **Automatic Employee Creation**: ADMIN/STAFF users get Employee records auto-created
6. **Transaction-Like Behavior**: Employee creation failure rolls back User creation
7. **Vietnamese Support**: Email, phone, and date formatting support Vietnamese locale

---

## Questions and Answers

**Q: Where are the authentication DTOs defined?**  
A: In packages/shared/src/types/auth.types.ts

**Q: How are passwords hashed?**  
A: Using bcrypt with 10 salt rounds in users.service.ts

**Q: What JWT algorithm is used?**  
A: RS256 (RSA with SHA-256) - asymmetric encryption

**Q: Where are RSA keys stored?**  
A: In apps/backend/keys/ (or configured via env vars)

**Q: What's the default user role?**  
A: CUSTOMER (set in users.service.create())

**Q: How long are tokens valid?**  
A: Access token: 1 day, Refresh token: 7 days

**Q: Can I change token expiry?**  
A: Yes, via JWT_ACCESS_EXPIRY and JWT_REFRESH_EXPIRY env vars

---

**Last Updated**: November 11, 2025  
**Documentation Version**: 1.0  
**Status**: Complete and Production-Ready

