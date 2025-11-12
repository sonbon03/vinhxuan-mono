# Development Guide - Vinh Xuan CMS

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- PostgreSQL (running on port 5434)
- Redis (running on port 6333)

### Installation

From the **root directory** (`vinhxuan-cms/`):

```bash
# Install all dependencies for both backend and frontend
yarn install
```

---

## Running Development Servers

### Option 1: Run Both Backend & Frontend (Recommended)

From the **root directory**:

```bash
# Start both backend and frontend in parallel
yarn dev

# OR
yarn start
```

This will start:
- **Backend:** http://localhost:8830
- **Frontend:** http://localhost:3000

### Option 2: Run Backend Only

From the **root directory**:

```bash
# Method 1: Using workspace command
yarn dev:backend

# Method 2: Using direct command
yarn start:backend

# Method 3: With auto-reload on file changes
yarn dev:backend:watch
```

Or from `apps/backend/` directory:

```bash
cd apps/backend
yarn dev
```

### Option 3: Run Frontend Only

From the **root directory**:

```bash
# Method 1: Using workspace command
yarn dev:frontend

# Method 2: Using direct command
yarn start:frontend
```

Or from `apps/frontend/` directory:

```bash
cd apps/frontend
yarn dev
```

---

## Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both backend and frontend |
| `yarn start` | Alias for `yarn dev` |
| `yarn dev:backend` | Start only backend server |
| `yarn dev:frontend` | Start only frontend server |
| `yarn dev:backend:watch` | Start backend with auto-reload |
| `yarn start:backend` | Start backend (alternative) |
| `yarn start:frontend` | Start frontend (alternative) |

### Building

| Command | Description |
|---------|-------------|
| `yarn build` | Build both backend and frontend |
| `yarn build:backend` | Build only backend |
| `yarn build:frontend` | Build only frontend |

### Testing

| Command | Description |
|---------|-------------|
| `yarn test` | Run all tests |
| `yarn test:backend` | Run backend tests |
| `yarn test:frontend` | Run frontend tests |

### Code Quality

| Command | Description |
|---------|-------------|
| `yarn lint` | Lint all code |
| `yarn lint:fix` | Lint and auto-fix issues |
| `yarn format` | Format code with Prettier |
| `yarn typecheck` | Check TypeScript types |

### Maintenance

| Command | Description |
|---------|-------------|
| `yarn clean` | Remove all node_modules |
| `yarn install:all` | Reinstall all dependencies |

---

## Troubleshooting

### Issue: "Cannot run yarn dev"

**Solution 1:** Make sure you're in the root directory (`vinhxuan-cms/`)

```bash
# Check current directory
pwd
# Should show: /Users/.../VinhXuan-Mono/vinhxuan-cms

# If you're in apps/backend or apps/frontend, go back to root
cd ../..
```

**Solution 2:** Install concurrently if missing

```bash
# Check if concurrently is installed
yarn list --pattern concurrently

# If not installed, run:
yarn add -W -D concurrently
```

**Solution 3:** Run servers individually

```bash
# Terminal 1: Start backend
yarn dev:backend

# Terminal 2: Start frontend (in a new terminal)
yarn dev:frontend
```

### Issue: "Port already in use"

**Backend (port 8830):**

```bash
# Find and kill process on port 8830
lsof -ti:8830 | xargs kill -9

# Then start backend again
yarn dev:backend
```

**Frontend (port 3000):**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then start frontend again
yarn dev:frontend
```

### Issue: Database connection error

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5434

# Check if Redis is running
redis-cli -p 6333 ping

# If not running, start them:
# PostgreSQL
brew services start postgresql@14

# Redis
brew services start redis
```

### Issue: Module not found errors

```bash
# Clean and reinstall all dependencies
yarn clean
yarn install
```

---

## Project Structure

```
vinhxuan-cms/
├── apps/
│   ├── backend/          # NestJS Backend (Port 8830)
│   │   ├── src/
│   │   ├── keys/         # RSA keys for JWT
│   │   └── package.json
│   │
│   └── frontend/         # React Frontend (Port 3000)
│       ├── src/
│       └── package.json
│
├── packages/             # Shared packages
│   └── shared/
│
├── package.json          # Root workspace configuration
├── CLAUDE.md             # Project requirements (PRD)
├── implementation-plan.md
├── RSA256-TEST-REPORT.md
├── CRUD-TEST-REPORT.md
└── DEV-GUIDE.md         # This file
```

---

## Environment Variables

### Backend (.env in apps/backend/)

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_NAME=vinhxuan_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6333

# JWT (RSA256)
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

# Server
PORT=8830
NODE_ENV=development
```

### Frontend (.env in apps/frontend/)

```bash
# API URL
VITE_API_URL=http://localhost:8830/api

# Environment
VITE_NODE_ENV=development
```

---

## API Documentation

Once the backend is running, visit:

- **Swagger UI:** http://localhost:8830/api/docs

---

## Recommended Development Workflow

1. **Start Development Servers:**
   ```bash
   # From root directory
   yarn dev
   ```

2. **Open in Browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8830/api
   - API Docs: http://localhost:8830/api/docs

3. **Make Changes:**
   - Backend code in `apps/backend/src/`
   - Frontend code in `apps/frontend/src/`
   - Both will auto-reload on save

4. **Test Changes:**
   ```bash
   # Run tests
   yarn test:backend
   yarn test:frontend
   ```

5. **Commit Changes:**
   ```bash
   # Format code
   yarn format

   # Lint and fix
   yarn lint:fix

   # Type check
   yarn typecheck

   # Commit
   git add .
   git commit -m "Your commit message"
   ```

---

## Tips

### Use Multiple Terminals

For better control, use separate terminals:

```bash
# Terminal 1: Backend
yarn dev:backend

# Terminal 2: Frontend
yarn dev:frontend

# Terminal 3: Run tests, scripts, etc.
yarn test:backend
```

### Watch Mode

The backend has a watch mode that auto-reloads on file changes:

```bash
yarn dev:backend:watch
```

### Quick Database Reset

```bash
# From backend directory
cd apps/backend

# Run migrations
yarn migration:run

# Seed database
yarn seed:run
```

---

## Need Help?

- Check logs in the terminal where the server is running
- Backend logs show detailed error messages
- Frontend console shows React errors
- API errors visible in Network tab of browser DevTools

---

**Happy Coding! 🚀**
