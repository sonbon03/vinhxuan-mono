# Railway Deployment Guide for VinhXuan CMS Backend

## Overview
This guide explains how to deploy the NestJS backend of VinhXuan CMS monorepo to Railway.

## Prerequisites
1. Railway account (https://railway.app)
2. Railway CLI installed (optional)
3. Git repository connected to Railway

## Problem Fixed
**Issue**: Railway couldn't find `@vinhxuan/shared` workspace package during build.

**Solution**: Updated Dockerfile to properly handle monorepo workspace dependencies by:
- Copying `packages/shared` into build context
- Ensuring yarn workspace resolution works correctly
- Copying shared package in both builder and production stages

## Configuration Files

### 1. railway.toml (Root)
Location: `vinhxuan-cms/railway.toml`

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/backend/Dockerfile"

[deploy]
startCommand = "node apps/backend/dist/main.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
healthcheckPath = "/health"
healthcheckTimeout = 10
```

### 2. Dockerfile Updates
Location: `vinhxuan-cms/apps/backend/Dockerfile`

**Key Changes:**
- Added workspace package copying before `yarn install`
- Ensured both builder and production stages have access to `@vinhxuan/shared`

```dockerfile
# Copy workspace packages
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/
```

## Deployment Steps

### Option 1: Railway Dashboard (Recommended)

1. **Connect Repository**
   - Go to Railway Dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Root Directory**
   - In project settings, set **Root Directory** to: `vinhxuan-cms`
   - Railway will automatically detect `railway.toml`

3. **Set Environment Variables**
   Required variables:
   ```env
   NODE_ENV=production
   PORT=8830

   # Database
   DATABASE_HOST=your-postgres-host
   DATABASE_PORT=5432
   DATABASE_NAME=vinhxuan_db
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your-password

   # Redis
   REDIS_HOST=your-redis-host
   REDIS_PORT=6379

   # JWT
   JWT_PRIVATE_KEY=your-private-key
   JWT_PUBLIC_KEY=your-public-key
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Deploy**
   - Click "Deploy"
   - Railway will use the Dockerfile and railway.toml config
   - Monitor build logs for any issues

### Option 2: Railway CLI

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Initialize Project**
   ```bash
   cd vinhxuan-cms
   railway init
   ```

3. **Link to Project**
   ```bash
   railway link
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DATABASE_HOST=your-postgres-host
   # ... set other variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Important Notes

### Build Context
- Railway MUST build from root (`vinhxuan-cms`) directory
- The Dockerfile path is relative to root: `apps/backend/Dockerfile`
- Build context includes both `apps/backend` and `packages/shared`

### Dockerfile Structure
The multi-stage Dockerfile:
1. **Builder Stage**: Installs dependencies and builds TypeScript
2. **Production Stage**: Copies built files and installs production dependencies only

### Workspace Resolution
- Yarn workspaces resolve `@vinhxuan/shared` locally
- No need to publish to npm registry
- Shared package is included in Docker image

### Health Check
- Endpoint: `/health`
- Railway uses this to monitor application health
- Ensure your NestJS app has a health check endpoint

## Troubleshooting

### Error: "Couldn't find package @vinhxuan/shared"
**Cause**: Build context doesn't include workspace packages

**Solution**: Ensure:
1. Root directory is set to `vinhxuan-cms`
2. Dockerfile copies `packages/shared` before `yarn install`
3. `railway.toml` has correct `dockerfilePath`

### Error: "Cannot find module @vinhxuan/shared"
**Cause**: Production stage missing shared package

**Solution**: Verify production stage in Dockerfile copies shared package

### Build Taking Too Long
**Optimization**:
1. Use `.dockerignore` to exclude unnecessary files
2. Leverage Docker layer caching
3. Consider using `yarn install --production` in production stage

### Port Binding Issues
**Solution**: Ensure backend listens on `process.env.PORT` (Railway automatically sets this)

```typescript
const port = process.env.PORT || 8830;
await app.listen(port, '0.0.0.0');
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Node environment | production |
| PORT | No | Application port (Railway sets this) | 8830 |
| DATABASE_HOST | Yes | PostgreSQL host | postgres.railway.internal |
| DATABASE_PORT | Yes | PostgreSQL port | 5432 |
| DATABASE_NAME | Yes | Database name | vinhxuan_db |
| DATABASE_USER | Yes | Database username | postgres |
| DATABASE_PASSWORD | Yes | Database password | your-secure-password |
| REDIS_HOST | Yes | Redis host | redis.railway.internal |
| REDIS_PORT | Yes | Redis port | 6379 |
| JWT_PRIVATE_KEY | Yes | RSA private key | your-private-key |
| JWT_PUBLIC_KEY | Yes | RSA public key | your-public-key |
| JWT_EXPIRES_IN | Yes | Access token expiry | 1d |
| JWT_REFRESH_EXPIRES_IN | Yes | Refresh token expiry | 7d |

## Post-Deployment

### Verify Deployment
1. Check build logs for errors
2. Test health endpoint: `https://your-app.railway.app/health`
3. Test API endpoints: `https://your-app.railway.app/api`

### Run Migrations
If using TypeORM migrations:
```bash
railway run yarn migration:run
```

### Monitor Application
- Use Railway dashboard for logs and metrics
- Set up alerts for downtime
- Monitor resource usage (CPU, Memory)

## Additional Resources
- [Railway Documentation](https://docs.railway.app)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NestJS Deployment](https://docs.nestjs.com/techniques/performance)

---

**Last Updated**: 2025-01-12
**Status**: Tested and Working ✅
