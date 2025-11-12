# 🚀 QUICKSTART GUIDE - Vinh Xuan CMS

This guide will help you get the Vinh Xuan CMS monorepo up and running in minutes.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Yarn** >= 1.22.0 (`npm install -g yarn`)
- **PostgreSQL** >= 14.0
- **Redis** >= 6.0
- **Git**

### Check Versions

```bash
node -v    # Should be >= 18.0.0
yarn -v    # Should be >= 1.22.0
psql --version   # PostgreSQL >= 14.0
redis-server --version   # Redis >= 6.0
```

---

## 🛠️ Initial Setup

### Step 1: Navigate to Project Directory

```bash
cd vinhxuan-cms
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
yarn install
```

This will install dependencies for:
- Root workspace
- Backend (`apps/backend`)
- Frontend (`apps/frontend`)
- Shared package (`packages/shared`)

### Step 3: Build Shared Package

```bash
# Build the shared types package
yarn build:shared
```

This is **crucial** because both backend and frontend depend on the shared package.

---

## 🗄️ Database Setup

### Step 1: Start PostgreSQL

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo service postgresql start
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vinhxuan_db;

# (Optional) Create dedicated user
CREATE USER vinhxuan_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vinhxuan_db TO vinhxuan_user;

# Exit
\q
```

### Step 3: Start Redis

**macOS:**
```bash
brew services start redis
```

**Linux:**
```bash
sudo service redis-server start
```

### Step 4: Verify Redis

```bash
redis-cli -p 6333 ping
# Should return: PONG
```

---

## ⚙️ Environment Configuration

### Backend Configuration

```bash
cd apps/backend
cp .env.example .env
```

**Edit `.env` file:**
```bash
# Application
NODE_ENV=development
PORT=8830

# Database
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=vinhxuan_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6333

# JWT (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env
```

**Edit `.env` file:**
```bash
VITE_API_BASE_URL=http://localhost:8830/api
VITE_APP_NAME=Vinh Xuan CMS
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Running the Application

### Option 1: Run Both Applications (Recommended)

From the **root directory**:

```bash
cd ../..  # Back to vinhxuan-cms root
yarn dev
```

This will start:
- **Backend**: http://localhost:8830
- **Frontend**: http://localhost:3000

### Option 2: Run Applications Separately

**Terminal 1 - Backend:**
```bash
cd apps/backend
yarn dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
yarn dev
```

---

## ✅ Verify Installation

### 1. Check Backend

Open your browser and navigate to:
- **API**: http://localhost:8830/api
- **API Documentation**: http://localhost:8830/api/docs
- **Health Check**: http://localhost:8830/api/health

You should see the Swagger API documentation.

### 2. Check Frontend

Navigate to:
- **Frontend**: http://localhost:3000

You should see the login page.

### 3. Test API with curl

```bash
# Health check
curl http://localhost:8830/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-10T...",
  "uptime": 123.456
}
```

---

## 👤 Create Your First User

### Option 1: Using Swagger UI

1. Navigate to http://localhost:8830/api/docs
2. Find the **POST /api/auth/register** endpoint
3. Click "Try it out"
4. Fill in the request body:

```json
{
  "fullName": "Admin User",
  "email": "admin@vinhxuan.com",
  "password": "Admin@123",
  "phone": "0901234567",
  "dateOfBirth": "1990-01-01"
}
```

5. Click "Execute"

### Option 2: Using curl

```bash
curl -X POST http://localhost:8830/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@vinhxuan.com",
    "password": "Admin@123",
    "phone": "0901234567",
    "dateOfBirth": "1990-01-01"
  }'
```

### Option 3: Using the Frontend

1. Navigate to http://localhost:3000/login
2. The login page is ready for testing

---

## 🧪 Testing the Authentication Flow

### 1. Register a User

Use one of the methods above to create a user.

### 2. Login

**Using curl:**
```bash
curl -X POST http://localhost:8830/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vinhxuan.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "fullName": "Admin User",
    "email": "admin@vinhxuan.com",
    "role": "CUSTOMER"
  }
}
```

### 3. Access Protected Endpoints

```bash
# Use the accessToken from the login response
curl http://localhost:8830/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📁 Project Structure

```
vinhxuan-cms/
├── apps/
│   ├── backend/              # NestJS Backend (Port 8830)
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   │   ├── auth/     # Authentication
│   │   │   │   └── users/    # User management
│   │   │   ├── config/       # Configuration files
│   │   │   ├── database/     # Migrations & seeds
│   │   │   └── main.ts       # Entry point
│   │   └── .env              # Backend environment
│   │
│   └── frontend/             # React Frontend (Port 3000)
│       ├── src/
│       │   ├── features/     # Feature modules
│       │   │   └── auth/     # Login page
│       │   ├── services/     # API services
│       │   ├── store/        # Zustand stores
│       │   └── main.tsx      # Entry point
│       └── .env              # Frontend environment
│
├── packages/
│   └── shared/               # Shared TypeScript types
│       └── src/
│           ├── types/        # Shared types
│           ├── constants/    # Shared constants
│           └── utils/        # Shared utilities
│
├── package.json              # Root workspace config
└── README.md                 # Main documentation
```

---

## 🔧 Common Commands

### Root Level

```bash
# Start both apps
yarn dev

# Build all workspaces
yarn build

# Run all tests
yarn test

# Lint all code
yarn lint

# Format all code
yarn format

# Type check all code
yarn typecheck

# Clean everything
yarn clean
```

### Backend Only

```bash
cd apps/backend

# Development
yarn dev

# Build
yarn build

# Run tests
yarn test

# Lint
yarn lint

# Database migrations
yarn migration:create
yarn migration:run
yarn migration:revert
```

### Frontend Only

```bash
cd apps/frontend

# Development
yarn dev

# Build
yarn build

# Run tests
yarn test

# Lint
yarn lint
```

### Shared Package

```bash
cd packages/shared

# Build types
yarn build

# Watch mode (auto-rebuild on changes)
yarn watch
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 8830):**
```bash
# Find process
lsof -ti:8830

# Kill process
kill -9 <PID>
```

**Frontend (Port 3000):**
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL status
brew services list | grep postgresql  # macOS
sudo service postgresql status        # Linux

# Restart PostgreSQL
brew services restart postgresql@14   # macOS
sudo service postgresql restart       # Linux
```

### Redis Connection Error

```bash
# Check Redis status
brew services list | grep redis       # macOS
sudo service redis-server status      # Linux

# Restart Redis
brew services restart redis           # macOS
sudo service redis-server restart     # Linux
```

### Shared Package Not Found

```bash
# Rebuild shared package
cd packages/shared
yarn build

# Then restart dev servers
cd ../..
yarn dev
```

### TypeScript Errors

```bash
# Clear all and reinstall
yarn clean
rm -rf node_modules
yarn install
yarn build:shared
```

---

## 📚 Next Steps

Now that you have the application running, here's what you can do next:

### 1. Review Documentation
- Read [CLAUDE.md](../CLAUDE.md) for complete project requirements
- Read [implementation-plan.md](../implementation-plan.md) for development roadmap

### 2. Start Development
- Follow the **Implementation Plan** to add new features
- Begin with **Phase 1: Foundation & Authentication**
- Implement modules sequentially as outlined in the plan

### 3. Customize Configuration
- Update JWT secrets in production
- Configure email service (SMTP)
- Set up cloud storage for file uploads
- Configure production database

### 4. Learn the Architecture
- Explore the **Yarn Workspaces** setup
- Understand how **shared types** work
- Review the **authentication flow**
- Study the **API structure**

---

## 🎯 Development Workflow

### Adding a New Feature

1. **Plan the feature**
   - Review requirements in CLAUDE.md
   - Create implementation checklist

2. **Add shared types** (if needed)
   ```bash
   cd packages/shared/src/types
   # Create new type file
   # Export from index.ts
   yarn build
   ```

3. **Implement backend**
   ```bash
   cd apps/backend
   # Create module, service, controller
   # Add to app.module.ts
   ```

4. **Implement frontend**
   ```bash
   cd apps/frontend
   # Create feature components
   # Add routes
   # Connect to API
   ```

5. **Test and verify**
   ```bash
   yarn test
   yarn lint
   ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request for review
```

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the [implementation-plan.md](../implementation-plan.md)
3. Check the [CLAUDE.md](../CLAUDE.md) for requirements
4. Verify all prerequisites are installed correctly

---

## ✨ You're Ready!

Congratulations! 🎉 You now have a fully functional Vinh Xuan CMS development environment.

**What's working:**
- ✅ Yarn Workspaces monorepo
- ✅ Shared TypeScript types
- ✅ NestJS backend with authentication
- ✅ React frontend with login page
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ API documentation (Swagger)

**Start building amazing features!** 🚀

---

**Last Updated:** November 10, 2025
**Version:** 1.0.0
