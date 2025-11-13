# Vinh Xuan CMS - Deployment Guide

This guide covers deployment strategies for the Vinh Xuan CMS monorepo after the packages/shared removal and nginx replacement.

## Table of Contents

- [Project Structure](#project-structure)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Environment Variables](#environment-variables)

---

## Project Structure

```
vinhxuan-cms/
├── apps/
│   ├── backend/          # NestJS API (Port 8830)
│   ├── frontend/         # Admin CMS (Port 3000)
│   └── user-frontend/    # Public Website (Port 3005 / 8088)
├── docker-compose.prod.yml
├── railway.toml
├── netlify.toml
└── DEPLOYMENT-GUIDE.md
```

**Key Changes:**
- ✅ Removed `packages/shared` - Each app now has its own types
- ✅ Replaced nginx with `serve` for frontend containers
- ✅ Simplified monorepo structure

---

## Docker Deployment

### 1. Backend Only (Recommended for Railway/Render)

```bash
# Build backend Docker image
docker build -f apps/backend/Dockerfile -t vinhxuan-backend .

# Run backend container
docker run -p 8830:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-db-password \
  -e JWT_ACCESS_SECRET=your-secret \
  -e REDIS_HOST=your-redis-host \
  vinhxuan-backend
```

**Environment Variables Required:**
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

### 2. Full Stack with Docker Compose

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

**Services Included:**
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 8830)
- Frontend (optional, port 3000)
- User Frontend (optional, port 8088)

### 3. Frontend Containers

**Admin Frontend:**
```bash
docker build -f apps/frontend/Dockerfile -t vinhxuan-frontend .
docker run -p 3000:3000 vinhxuan-frontend
```

**User Frontend:**
```bash
docker build -f apps/user-frontend/Dockerfile -t vinhxuan-user-frontend .
docker run -p 8088:8088 vinhxuan-user-frontend
```

**Note:** Frontend containers now use `serve` instead of nginx for simplicity.

---

## Vercel Deployment

### Deploy Admin Frontend

1. **Link to Vercel:**
   ```bash
   cd apps/frontend
   vercel
   ```

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `cd ../.. && yarn install && cd apps/frontend && yarn build`
   - **Output Directory:** `dist`
   - **Install Command:** `cd ../.. && yarn install`

3. **Environment Variables (Optional):**
   - `VITE_API_URL` - Your backend API URL

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Deploy User Frontend

1. **Link to Vercel:**
   ```bash
   cd apps/user-frontend
   vercel
   ```

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/user-frontend`
   - **Build Command:** `cd ../.. && yarn install && cd apps/user-frontend && yarn build`
   - **Output Directory:** `dist`
   - **Install Command:** `cd ../.. && yarn install`

3. **Environment Variables (Optional):**
   - `VITE_API_URL` - Your backend API URL

4. **Deploy:**
   ```bash
   vercel --prod
   ```

**Configuration Files:**
- `apps/frontend/vercel.json` - Admin frontend config
- `apps/user-frontend/vercel.json` - User frontend config

---

## Railway Deployment

Railway is recommended for **backend deployment**.

### 1. Setup Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Configure railway.toml

The `railway.toml` file is already configured:

```toml
[build]
builder = "dockerfile"
dockerfilePath = "apps/backend/Dockerfile"

[deploy]
startCommand = "node /app/apps/backend/dist/main"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
```

### 3. Add Services

**PostgreSQL:**
```bash
railway add --database postgres
```

**Redis:**
```bash
railway add --database redis
```

### 4. Set Environment Variables

```bash
# Database (auto-configured by Railway)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# Redis (auto-configured by Railway)
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}

# JWT Secrets (generate strong secrets)
JWT_ACCESS_SECRET=your-very-strong-secret-key-here
JWT_REFRESH_SECRET=your-very-strong-refresh-secret-key-here
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app,https://your-user-frontend.vercel.app

# Optional
NODE_ENV=production
PORT=8830
```

### 5. Generate RSA Keys for JWT

Railway automatically reads from environment variables:

```bash
# Generate RSA keys locally
cd apps/backend
chmod +x scripts/generate-rsa-keys.sh
./scripts/generate-rsa-keys.sh

# Copy the keys content
cat keys/private.pem
cat keys/public.pem

# Add to Railway environment variables
JWT_PRIVATE_KEY=<paste-private-key-content>
JWT_PUBLIC_KEY=<paste-public-key-content>
```

### 6. Deploy

```bash
railway up
```

**Railway Dashboard:** https://railway.app/dashboard

---

## Netlify Deployment

Netlify can be used for **frontend deployments**.

### Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy frontend
cd apps/frontend
netlify deploy --prod

# Deploy user-frontend
cd apps/user-frontend
netlify deploy --prod
```

### Deploy via Git (Recommended)

1. **Connect Repository:** Link your GitHub/GitLab repo to Netlify

2. **Configure Build Settings:**
   - **Base Directory:** `apps/frontend` or `apps/user-frontend`
   - **Build Command:** `yarn build:frontend` or `yarn build:user`
   - **Publish Directory:** `apps/frontend/dist` or `apps/user-frontend/dist`

3. **Environment Variables:**
   - `VITE_API_URL` - Your backend API URL

**Configuration File:**
- `netlify.toml` (root level)

---

## Environment Variables

### Backend (.env)

```bash
# Node Environment
NODE_ENV=production
PORT=8830

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=vinhxuan_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT with RSA256
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

# RSA Keys (for Railway/Cloud deployment)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3005

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### Frontend (.env)

```bash
# API URL
VITE_API_URL=http://localhost:8830/api

# Or for production
VITE_API_URL=https://your-backend.railway.app/api
```

### User Frontend (.env)

```bash
# API URL
VITE_API_URL=http://localhost:8830/api

# Or for production
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Deployment Checklist

### Before Deployment

- [ ] Remove `packages/shared` references from all configs ✅
- [ ] Update all environment variables
- [ ] Generate RSA keys for JWT
- [ ] Test build locally:
  - [ ] `yarn build:backend`
  - [ ] `yarn build:frontend`
  - [ ] `yarn build:user`
- [ ] Test Docker builds:
  - [ ] `docker build -f apps/backend/Dockerfile -t backend-test .`
  - [ ] `docker build -f apps/frontend/Dockerfile -t frontend-test .`
  - [ ] `docker build -f apps/user-frontend/Dockerfile -t user-frontend-test .`

### After Deployment

- [ ] Verify API health endpoint: `https://your-backend.com/api/health`
- [ ] Test frontend-backend connection
- [ ] Run database migrations (if needed)
- [ ] Seed initial admin user (if needed)
- [ ] Test authentication flow
- [ ] Check CORS configuration
- [ ] Monitor application logs
- [ ] Set up monitoring/alerts (optional)

---

## Common Issues

### Build Fails with "Cannot find @shared"

**Solution:** Ensure all `@shared` imports have been replaced with local types:
- Backend: `src/common/enums`, `src/common/types`
- Frontend: `@/types`

### Docker Build Fails

**Solution:** Clear Docker cache and rebuild:
```bash
docker system prune -a
docker build --no-cache -f apps/backend/Dockerfile -t vinhxuan-backend .
```

### Railway Build Fails

**Solution:** Check `railway.toml` and ensure:
- `dockerfilePath` points to correct Dockerfile
- All environment variables are set
- RSA keys are properly formatted

### CORS Errors

**Solution:** Update `CORS_ORIGIN` environment variable:
```bash
CORS_ORIGIN=https://frontend1.vercel.app,https://frontend2.vercel.app
```

---

## Support

For issues or questions:
- Check logs: `docker logs <container-id>` or Railway logs
- Verify environment variables are set correctly
- Ensure database and Redis are accessible

---

**Last Updated:** November 14, 2025
**Version:** 2.0 (Post packages/shared removal)
