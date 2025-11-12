# VINH XUÂN CMS - IMPLEMENTATION PLAN

**Project:** Vinh Xuân Notary Services Management System
**Architecture:** Monorepo with 3 Applications
**Version:** 1.0
**Last Updated:** November 11, 2025

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Applications](#applications)
4. [Development Workflow](#development-workflow)
5. [Deployment Strategy](#deployment-strategy)
6. [Testing Strategy](#testing-strategy)
7. [Implementation Phases](#implementation-phases)

---

## PROJECT OVERVIEW

### Purpose

The Vinh Xuân CMS is a comprehensive system for managing notary services, consisting of three integrated applications:

1. **Backend API** - NestJS-based REST API serving both frontend applications
2. **Admin CMS** - Internal management interface for staff and administrators
3. **User Website** - Public-facing website for customers to access services

### Technology Stack

- **Package Manager:** Yarn Workspaces
- **Backend:** NestJS 11 + TypeORM + PostgreSQL + Redis
- **Admin Frontend:** React 18 + Ant Design + styled-components
- **User Frontend:** React 18 + shadcn/ui + Tailwind CSS
- **Build Tools:** Vite (frontends), TypeScript (all)

---

## ARCHITECTURE

### Monorepo Structure

```
vinhxuan-cms/
├── apps/
│   ├── backend/          # NestJS Backend API (Port 8830)
│   ├── frontend/         # Admin/Staff CMS (Port 3000)
│   └── user-frontend/    # Public User Website (Port 3005)
├── packages/
│   └── shared/           # Shared types, utils, constants
├── package.json          # Root workspace configuration
└── yarn.lock             # Root lock file
```

### Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌──────────────────┐          ┌──────────────────┐     │
│  │   Admin CMS      │          │  User Website    │     │
│  │   (Port 3000)    │          │   (Port 3005)    │     │
│  │  Ant Design UI   │          │   shadcn/ui      │     │
│  └─────────┬────────┘          └────────┬─────────┘     │
└────────────┼─────────────────────────────┼───────────────┘
             │                             │
             └──────────────┬──────────────┘
                            ▼
             ┌──────────────────────────────┐
             │    Backend API (Port 8830)   │
             │         NestJS 11            │
             │    JWT Authentication        │
             │      RBAC Authorization      │
             └──────────────┬───────────────┘
                            │
                ┌───────────┴──────────┐
                ▼                      ▼
         ┌─────────────┐        ┌──────────┐
         │ PostgreSQL  │        │  Redis   │
         │ (Port 5434) │        │ (Port    │
         │             │        │  6333)   │
         └─────────────┘        └──────────┘
```

### Port Allocation

| Application | Port | Purpose |
|------------|------|---------|
| Backend API | 8830 | REST API server |
| Admin CMS | 3000 | Internal staff/admin interface |
| User Website | 3005 | Public customer interface |
| PostgreSQL | 5434 | Database server |
| Redis | 6333 | Cache and session storage |

---

## APPLICATIONS

### 1. Backend API (apps/backend)

**Purpose:** Centralized REST API serving both frontend applications

**Key Features:**
- User authentication and authorization (JWT + RSA256)
- Role-based access control (Admin, Staff, Customer)
- Business logic for all modules
- Database operations via TypeORM
- Redis caching for performance

**Module Structure:**
```
apps/backend/src/
├── modules/
│   ├── auth/              # Authentication & JWT
│   ├── users/             # User management
│   ├── employees/         # Employee management
│   ├── services/          # Service catalog
│   ├── fee-types/         # Fee type management
│   ├── calculations/      # Fee calculation engine
│   ├── records/           # Record management
│   ├── articles/          # Article/news management
│   ├── listings/          # Property listing management
│   ├── consultations/     # Consultation scheduling
│   ├── campaigns/         # Email marketing
│   ├── chatbot/           # Chatbot integration
│   ├── statistics/        # Analytics & reporting
│   ├── files/             # File upload/management
│   └── categories/        # Category management
├── common/                # Shared guards, decorators, filters
├── config/                # Configuration files
└── database/              # Migrations and seeds
```

**API Conventions:**
- RESTful endpoints using plural nouns
- JWT bearer token authentication
- Standardized response format
- Comprehensive error handling

### 2. Admin CMS (apps/frontend)

**Purpose:** Internal management interface for staff and administrators

**Key Features:**
- User and employee management
- Service and fee type configuration
- Record approval workflow
- Content management (articles, listings)
- Consultation scheduling
- Email campaign management
- Analytics dashboard

**Technology:**
- React 18 with TypeScript
- Ant Design for UI components
- styled-components for custom styling
- React Router v6 for routing
- React Query for server state
- Zustand for client state
- React Hook Form + Zod for forms

**Module Structure:**
```
apps/frontend/src/
├── components/            # Reusable UI components
│   ├── common/           # Common components (Button, Input, Card)
│   ├── layout/           # Layout components (Header, Sidebar, Footer)
│   ├── forms/            # Form components
│   └── charts/           # Chart components
├── features/             # Feature-based modules
│   ├── auth/            # Login, register
│   ├── users/           # User management pages
│   ├── employees/       # Employee management pages
│   ├── services/        # Service management pages
│   ├── fee-calculator/  # Fee calculation tool
│   ├── records/         # Record management pages
│   ├── articles/        # Article management pages
│   ├── listings/        # Listing management pages
│   ├── consultations/   # Consultation pages
│   ├── campaigns/       # Email campaign pages
│   ├── chatbot/         # Chatbot management
│   └── statistics/      # Analytics dashboard
├── hooks/                # Custom React hooks
├── services/             # API service layer
├── store/                # State management (Zustand)
├── utils/                # Utility functions
├── types/                # TypeScript types
└── App.tsx               # Root component
```

### 3. User Website (apps/user-frontend)

**Purpose:** Public-facing website for customers to access services

**Key Features:**
- Browse notary services
- Calculate service fees
- Submit consultation requests
- Create and manage records
- View articles and news
- Browse property listings
- User account management

**Technology:**
- React 18 with TypeScript
- shadcn/ui for UI components
- Tailwind CSS for styling
- React Router v6 for routing
- React Query for server state
- Google Maps integration

**Module Structure:**
```
apps/user-frontend/src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── custom/          # Custom components
├── pages/               # Page components
│   ├── home/           # Landing page
│   ├── services/       # Service catalog
│   ├── calculator/     # Fee calculator
│   ├── consultation/   # Consultation booking
│   ├── articles/       # News and articles
│   ├── listings/       # Property listings
│   └── account/        # User account pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── config/              # Configuration
└── App.tsx              # Root component
```

**API Integration:**
```typescript
// apps/user-frontend/src/config/api.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8830/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

---

## DEVELOPMENT WORKFLOW

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd vinhxuan-cms

# Install all dependencies (root + all workspaces)
yarn install

# Setup environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/user-frontend/.env.template apps/user-frontend/.env

# Configure environment variables in each .env file
```

### Database Setup

```bash
# Start PostgreSQL (port 5434) and Redis (port 6333)

# Navigate to backend
cd apps/backend

# Run migrations
yarn migration:run

# Seed initial data (optional)
yarn seed:run
```

### Development Mode

**Start all applications:**
```bash
# From root directory
yarn dev

# This runs concurrently:
# - Backend on port 8830
# - Admin CMS on port 3000
# - User Website on port 3005
```

**Start individual applications:**
```bash
# Backend only
yarn dev:backend

# Admin CMS only
yarn dev:frontend

# User Website only
yarn dev:user
```

### Common Development Tasks

**Add new npm package:**
```bash
# For backend
yarn workspace backend add <package-name>

# For admin frontend
yarn workspace frontend add <package-name>

# For user frontend
yarn workspace @vinhxuan/user-frontend add <package-name>
```

**Run tests:**
```bash
# All tests
yarn test

# Backend tests
yarn test:backend

# Frontend tests (when implemented)
yarn test:frontend
```

**Build for production:**
```bash
# Build all applications
yarn build

# Build individual applications
yarn build:backend
yarn build:frontend
yarn build:user
```

**Database migrations:**
```bash
cd apps/backend

# Create new migration
yarn migration:generate src/database/migrations/MigrationName

# Run pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Show migration status
yarn migration:show
```

### Code Quality

**Linting:**
```bash
# Lint all workspaces
yarn lint

# Fix linting issues
yarn lint:fix
```

**Type checking:**
```bash
# Check TypeScript types
yarn typecheck
```

**Code formatting:**
```bash
# Format all files
yarn format
```

---

## DEPLOYMENT STRATEGY

### Production Build

```bash
# Build all applications for production
yarn build

# Output directories:
# - apps/backend/dist/
# - apps/frontend/dist/
# - apps/user-frontend/dist/
```

### Environment Configuration

**Backend (.env):**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_NAME=vinhxuan_db
DATABASE_USER=postgres
DATABASE_PASSWORD=<password>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6333

# JWT
JWT_SECRET=<secret>
JWT_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

# Server
PORT=8830
NODE_ENV=production
```

**Admin CMS (.env):**
```env
VITE_API_URL=https://api.vinhxuan.com/api
```

**User Website (.env):**
```env
VITE_API_URL=https://api.vinhxuan.com/api
VITE_GOOGLE_MAPS_API_KEY=<api-key>
```

### Deployment Options

**Option 1: Separate Servers**
- Backend: Node.js server (PM2 or Docker)
- Admin CMS: Static hosting (Nginx, Vercel, Netlify)
- User Website: Static hosting (Nginx, Vercel, Netlify)

**Option 2: Docker Containers**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./apps/backend
    ports:
      - "8830:8830"
    environment:
      - DATABASE_HOST=db
      - REDIS_HOST=redis

  admin:
    build: ./apps/frontend
    ports:
      - "3000:80"

  user:
    build: ./apps/user-frontend
    ports:
      - "3005:80"

  db:
    image: postgres:14
    ports:
      - "5434:5432"

  redis:
    image: redis:6
    ports:
      - "6333:6379"
```

---

## TESTING STRATEGY

### Unit Testing

**Backend (Jest):**
```bash
cd apps/backend
yarn test

# Test coverage
yarn test:cov

# Watch mode
yarn test:watch
```

**Frontend (Vitest):**
```bash
cd apps/frontend
yarn test

# Coverage
yarn test:coverage

# Watch mode
yarn test:watch
```

### Integration Testing

**API Testing:**
- Test all endpoints with authentication
- Test RBAC permissions
- Test database operations
- Test error handling

**Component Testing:**
- Test React components in isolation
- Test form validation
- Test user interactions

### E2E Testing

**Cypress/Playwright:**
```bash
# Run E2E tests
yarn e2e

# Test critical user journeys:
# - Login/logout flow
# - Record submission and approval
# - Consultation booking
# - Fee calculation
# - Article publishing
```

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Completed)

✅ **Backend Setup:**
- NestJS project structure
- Database schema and migrations
- Authentication with JWT
- RBAC implementation

✅ **Admin CMS Setup:**
- React project structure
- Ant Design integration
- Authentication flow
- Basic CRUD operations

✅ **Core Modules:**
- User management
- Employee management
- Service management
- Category management
- Record management
- Article management
- Listing management
- Consultation scheduling
- Email campaigns

### Phase 2: User Website Integration (Current)

🔄 **In Progress:**
- ✅ Integrate seo-notarization-fe into monorepo
- ✅ Configure as apps/user-frontend
- ✅ Update port to 3005
- ✅ Add to workspace scripts
- ✅ Create API configuration
- ✅ Update documentation (CLAUDE.md, implementation-plan.md)
- ⏳ Test integrated system
- ⏳ Connect to backend API
- ⏳ Implement authentication flow
- ⏳ Add user registration/login

**Next Steps:**
- Connect user-frontend to backend API
- Implement service browsing
- Implement fee calculator
- Implement consultation booking
- Implement user account management
- Implement article viewing
- Implement listing browsing

### Phase 3: Advanced Features (Planned)

**Fee Calculation Engine:**
- Dynamic form generation based on document type
- Complex fee calculation formulas
- Fee calculation history
- Export calculation results

**Email Marketing:**
- Campaign templates
- Automated email sending
- Birthday/holiday emails
- Email tracking and analytics

**Chatbot Integration:**
- AI-powered chatbot for customer support
- Integration with backend API
- Conversation history
- Escalation to human agents

**Analytics Dashboard:**
- Revenue reports
- User activity reports
- Record status reports
- Employee performance reports
- Export to PDF/Excel

### Phase 4: Optimization (Planned)

**Performance:**
- Redis caching strategy
- Database query optimization
- Frontend code splitting
- Image optimization
- CDN integration

**Security:**
- Security audit
- Penetration testing
- Rate limiting
- Input sanitization
- XSS/CSRF protection

**Monitoring:**
- Error tracking (Sentry)
- Performance monitoring
- Log aggregation
- Health checks
- Alerting system

### Phase 5: Production Deployment (Planned)

**Infrastructure:**
- Setup production servers
- Configure CI/CD pipeline
- Setup database backups
- Configure SSL certificates
- Setup monitoring and logging

**Testing:**
- Load testing
- Security testing
- User acceptance testing
- Performance testing

**Documentation:**
- User manuals
- Admin documentation
- API documentation
- Deployment guides

**Launch:**
- Soft launch (limited users)
- Monitoring and bug fixes
- Full production launch
- Post-launch support

---

## DEVELOPMENT GUIDELINES

### Code Standards

**TypeScript:**
- Strict mode enabled
- Explicit types for all function parameters and return values
- Use interfaces for object shapes
- Use enums for constants

**React:**
- Functional components with hooks
- Custom hooks for reusable logic
- Proper use of useEffect dependencies
- Memoization for performance (React.memo, useMemo, useCallback)

**Naming Conventions:**
- Components: PascalCase (e.g., UserListPage)
- Functions: camelCase (e.g., getUserById)
- Constants: UPPER_SNAKE_CASE (e.g., API_BASE_URL)
- Files: kebab-case for utils, PascalCase for components

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

**Commit Messages:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(users): add view detail page for users

- Create UserDetailPage component
- Add route for /users/:id
- Display user information with Ant Design Descriptions
- Add Edit button with proper permissions
```

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] TypeScript types are correct
- [ ] Responsive design works
- [ ] Accessibility standards met
- [ ] Security best practices followed
- [ ] Documentation updated

---

## TROUBLESHOOTING

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :8830

# Kill process
kill -9 <PID>
```

**Database connection error:**
- Check PostgreSQL is running on port 5434
- Verify credentials in .env file
- Ensure database exists

**Redis connection error:**
- Check Redis is running on port 6333
- Verify Redis is not password-protected (development)

**Yarn workspace issues:**
```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## CONTACTS

**Project Team:**
- Project Manager: [Name]
- Backend Lead: [Name]
- Frontend Lead: [Name]
- QA Lead: [Name]

**Support:**
- Email: support@vinhxuan.com
- Issue Tracker: [GitHub Issues URL]
- Documentation: [Documentation URL]

---

**Document Version:** 1.0
**Last Updated:** November 11, 2025
**Status:** Active Development
