# 🚀 Deployment Guide - Vinh Xuan CMS

Complete deployment guide for the Vinh Xuan CMS monorepo application.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Railway Deployment (Backend)](#railway-deployment-backend)
5. [Vercel Deployment (Frontends)](#vercel-deployment-frontends)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [Manual Deployment](#manual-deployment)
8. [Database Migrations](#database-migrations)
9. [Monitoring & Logs](#monitoring--logs)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   User Requests                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel CDN                           │
│  ┌──────────────────┐       ┌──────────────────┐       │
│  │  Admin Frontend  │       │  User Frontend   │       │
│  │   (Port 3000)    │       │   (Port 8088)    │       │
│  └──────────────────┘       └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Railway Platform                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              NestJS Backend API                  │   │
│  │              (Port 8830)                         │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                               │
│         ┌───────────────┴───────────────┐               │
│         ▼                               ▼               │
│  ┌─────────────┐               ┌─────────────┐          │
│  │ PostgreSQL  │               │   Redis     │          │
│  │  (Port 5432)│               │ (Port 6379) │          │
│  └─────────────┘               └─────────────┘          │
└─────────────────────────────────────────────────────────┘
```

**Deployment Stack:**
- **Frontend (Admin & User)**: Vercel (CDN + Static Hosting)
- **Backend**: Railway (Docker Compose)
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis
- **CI/CD**: GitHub Actions

---

## ✅ Prerequisites

### Required Accounts

1. **GitHub Account** (for code repository and CI/CD)
2. **Railway Account** (for backend deployment) - [Sign up](https://railway.app)
3. **Vercel Account** (for frontend deployment) - [Sign up](https://vercel.com)

### Required CLI Tools

```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel

# Verify installations
railway --version
vercel --version
```

### Local Development Tools

- Node.js 20+
- Yarn 1.22+
- Docker & Docker Compose (optional, for local testing)

---

## 🔐 Environment Variables

### Backend Environment Variables (Railway)

Create these in Railway dashboard or `.env` file:

```env
# Application
NODE_ENV=production
PORT=8830

# Database (Auto-provided by Railway PostgreSQL service)
DB_HOST=${{POSTGRES.RAILWAY_PRIVATE_DOMAIN}}
DB_PORT=5432
DB_USERNAME=${{POSTGRES.POSTGRES_USER}}
DB_PASSWORD=${{POSTGRES.POSTGRES_PASSWORD}}
DB_DATABASE=${{POSTGRES.POSTGRES_DB}}

# Redis (Auto-provided by Railway Redis service)
REDIS_HOST=${{REDIS.RAILWAY_PRIVATE_DOMAIN}}
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (Generate strong random secrets!)
JWT_ACCESS_SECRET=<generate-strong-random-secret-32-chars>
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=<generate-strong-random-secret-32-chars>
JWT_REFRESH_EXPIRY=7d

# CORS (Update with your Vercel frontend URLs)
CORS_ORIGIN=https://your-admin-domain.vercel.app,https://your-user-domain.vercel.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

**Generate JWT Secrets:**
```bash
# Generate strong random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables (Vercel)

**Admin Frontend (apps/frontend/.env.production):**
```env
VITE_API_URL=https://your-backend.railway.app
```

**User Frontend (apps/user-frontend/.env.production):**
```env
VITE_API_URL=https://your-backend.railway.app
```

---

## 🚂 Railway Deployment (Backend)

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select the repository
5. Choose the `main` branch

### Step 2: Add Database Services

**Add PostgreSQL:**
1. Click **"+ New Service"** → **"Database"** → **"PostgreSQL"**
2. Railway will auto-configure and provide connection variables
3. Note: Database variables are auto-injected as `${{POSTGRES.*}}`

**Add Redis:**
1. Click **"+ New Service"** → **"Database"** → **"Redis"**
2. Railway will auto-configure and provide connection variables
3. Note: Redis variables are auto-injected as `${{REDIS.*}}`

### Step 3: Configure Backend Service

1. Click on your backend service
2. Go to **"Settings"** → **"Environment Variables"**
3. Add all environment variables from the section above
4. Use Railway's reference variables for database connections:
   ```
   DB_HOST=${{POSTGRES.RAILWAY_PRIVATE_DOMAIN}}
   DB_PORT=5432
   DB_USERNAME=${{POSTGRES.POSTGRES_USER}}
   DB_PASSWORD=${{POSTGRES.POSTGRES_PASSWORD}}
   DB_DATABASE=${{POSTGRES.POSTGRES_DB}}
   ```

### Step 4: Configure Build Settings

1. Go to **"Settings"** → **"Build"**
2. Set **Root Directory**: Leave empty (monorepo root)
3. Set **Dockerfile Path**: `apps/backend/Dockerfile`
4. Set **Build Command**: (leave empty, Docker handles it)
5. Set **Start Command**: `node dist/main.js`

### Step 5: Deploy

1. Click **"Deploy"** or push to your GitHub repository
2. Railway will automatically build and deploy
3. Monitor logs in the **"Deployments"** tab
4. Once deployed, copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 6: Run Database Migrations

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run yarn workspace backend migration:run

# (Optional) Seed database
railway run yarn workspace backend seed:run
```

---

## ▲ Vercel Deployment (Frontends)

### Admin Frontend Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
   - **Install Command**: `yarn install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

6. Click **"Deploy"**
7. Copy your deployment URL (e.g., `https://vinhxuan-admin.vercel.app`)

### User Frontend Deployment

Repeat the same steps, but use:
- **Root Directory**: `apps/user-frontend`
- Same environment variables

---

## 🤖 GitHub Actions CI/CD

### Step 1: Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

#### Railway Secrets
```
RAILWAY_TOKEN=<your-railway-token>
BACKEND_URL=https://your-backend.railway.app
```

**Get Railway Token:**
```bash
railway login
railway whoami --token
```

#### Vercel Secrets
```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID_ADMIN=<admin-project-id>
VERCEL_PROJECT_ID_USER=<user-project-id>
```

**Get Vercel Token:**
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with full access
3. Copy the token

**Get Vercel IDs:**
```bash
cd apps/frontend
vercel link
cat .vercel/project.json
# Copy orgId and projectId
```

#### Environment Variables
```
VITE_API_URL=https://your-backend.railway.app
```

### Step 2: Enable GitHub Actions

The workflows are already configured in `.github/workflows/`:
- `test.yml` - Runs tests on every push
- `deploy-backend.yml` - Deploys backend to Railway
- `deploy-frontend.yml` - Deploys frontends to Vercel

**Workflow Triggers:**
- Push to `main` or `production` branch
- Manual trigger via **Actions** tab

### Step 3: Verify Deployment

1. Push changes to `main` branch
2. Go to **Actions** tab in GitHub
3. Monitor workflow execution
4. Verify deployment success

---

## 🛠️ Manual Deployment

### Backend Manual Deployment

```bash
# Build and deploy to Railway
cd vinhxuan-cms
railway login
railway link
railway up --service backend

# Run migrations
railway run yarn workspace backend migration:run
```

### Frontend Manual Deployment

```bash
# Deploy Admin Frontend
cd apps/frontend
vercel --prod

# Deploy User Frontend
cd apps/user-frontend
vercel --prod
```

---

## 🗄️ Database Migrations

### Create Migration

```bash
# Generate migration based on entity changes
yarn workspace backend migration:generate -n MigrationName

# Create empty migration
yarn workspace backend migration:create -n MigrationName
```

### Run Migrations

**Local:**
```bash
yarn workspace backend migration:run
```

**Railway:**
```bash
railway run yarn workspace backend migration:run
```

### Rollback Migration

```bash
# Local
yarn workspace backend migration:revert

# Railway
railway run yarn workspace backend migration:revert
```

### Show Migrations

```bash
railway run yarn workspace backend migration:show
```

---

## 📊 Monitoring & Logs

### Railway Logs

1. Go to Railway Dashboard
2. Select your project
3. Click on service → **"Deployments"** → **"View Logs"**

**CLI Logs:**
```bash
railway logs --service backend
```

### Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"** → Select deployment → **"Logs"**

**CLI Logs:**
```bash
vercel logs <deployment-url>
```

### Health Checks

**Backend Health:**
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "redis": "connected"
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend fails to connect to database

**Solution:**
- Verify Railway database service is running
- Check environment variables reference format: `${{POSTGRES.RAILWAY_PRIVATE_DOMAIN}}`
- Ensure database service is linked to backend service

#### 2. CORS errors on frontend

**Solution:**
- Update `CORS_ORIGIN` in Railway with exact Vercel URLs
- Include both admin and user frontend URLs
- Restart backend service after updating

#### 3. Build fails in GitHub Actions

**Solution:**
- Verify all GitHub secrets are set correctly
- Check if Railway/Vercel tokens are valid
- Review workflow logs for specific errors

#### 4. Frontend can't reach backend API

**Solution:**
- Verify `VITE_API_URL` in Vercel environment variables
- Ensure backend is deployed and accessible
- Check browser console for network errors

#### 5. Database migrations fail

**Solution:**
```bash
# Check migration status
railway run yarn workspace backend migration:show

# Revert last migration if needed
railway run yarn workspace backend migration:revert

# Re-run migrations
railway run yarn workspace backend migration:run
```

### Debug Commands

```bash
# Check Railway service status
railway status

# View Railway environment variables
railway variables

# Test database connection
railway run yarn workspace backend migration:show

# Check Vercel deployment status
vercel ls

# Check Vercel environment variables
vercel env ls
```

---

## 🔄 Update Deployment

### Update Backend

```bash
# Option 1: Push to GitHub (auto-deploy via GitHub Actions)
git add .
git commit -m "Update backend"
git push origin main

# Option 2: Manual Railway deployment
railway up --service backend
```

### Update Frontend

```bash
# Option 1: Push to GitHub (auto-deploy via GitHub Actions)
git add .
git commit -m "Update frontend"
git push origin main

# Option 2: Manual Vercel deployment
cd apps/frontend
vercel --prod
```

---

## 📝 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)
- [NestJS Deployment Guide](https://docs.nestjs.com/faq/deployment)

---

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check Railway/Vercel status pages
2. Review application logs
3. Verify all environment variables
4. Check GitHub Actions workflow logs
5. Contact DevOps team or create an issue in repository

---

**Deployment Checklist:**

- [ ] Railway project created with PostgreSQL and Redis
- [ ] Backend deployed to Railway with correct environment variables
- [ ] Database migrations executed successfully
- [ ] Admin Frontend deployed to Vercel
- [ ] User Frontend deployed to Vercel
- [ ] GitHub secrets configured for CI/CD
- [ ] CORS configured with correct frontend URLs
- [ ] Health checks passing for all services
- [ ] Domain names configured (if applicable)
- [ ] SSL certificates active
- [ ] Monitoring and logging enabled

---

**Last Updated:** November 12, 2025
**Version:** 1.0.0
