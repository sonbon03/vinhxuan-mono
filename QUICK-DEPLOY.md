# 🚀 Quick Deploy Guide

**Get your Vinh Xuan CMS deployed in 15 minutes!**

---

## 📋 Prerequisites

1. ✅ GitHub account with your code repository
2. ✅ Railway account ([Sign up free](https://railway.app))
3. ✅ Vercel account ([Sign up free](https://vercel.com))

---

## 🚂 Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Create Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Select your `vinhxuan-cms` repository
4. Choose `main` branch

### 1.2 Add Database Services

**Add PostgreSQL:**
- Click **"+ New"** → **"Database"** → **"PostgreSQL"**
- Wait for provisioning (auto-configured)

**Add Redis:**
- Click **"+ New"** → **"Database"** → **"Redis"**
- Wait for provisioning (auto-configured)

### 1.3 Configure Backend Service

1. Click on your **backend service**
2. Go to **"Settings"**
3. Set **Dockerfile Path**: `apps/backend/Dockerfile`
4. Go to **"Variables"** tab
5. Add these environment variables:

```bash
NODE_ENV=production
PORT=8830

# Database (auto-filled by Railway)
DB_HOST=${{POSTGRES.RAILWAY_PRIVATE_DOMAIN}}
DB_PORT=5432
DB_USERNAME=${{POSTGRES.POSTGRES_USER}}
DB_PASSWORD=${{POSTGRES.POSTGRES_PASSWORD}}
DB_DATABASE=${{POSTGRES.POSTGRES_DB}}

# Redis (auto-filled by Railway)
REDIS_HOST=${{REDIS.RAILWAY_PRIVATE_DOMAIN}}
REDIS_PORT=6379

# JWT (IMPORTANT: Generate new secrets!)
JWT_ACCESS_SECRET=<paste-generated-secret>
JWT_REFRESH_SECRET=<paste-generated-secret>
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

# CORS (update after Vercel deployment)
CORS_ORIGIN=https://your-admin.vercel.app,https://your-user.vercel.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

**Generate JWT Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Run this twice to get two different secrets.

### 1.4 Deploy & Run Migrations

1. Click **"Deploy"** (Railway will auto-build)
2. Wait for deployment (3-5 minutes)
3. Copy your backend URL from Railway (e.g., `https://your-app.railway.app`)
4. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   railway link  # Select your project
   ```
5. Run migrations:
   ```bash
   railway run yarn workspace backend migration:run
   ```

✅ **Backend deployed!** Save your Railway backend URL.

---

## ▲ Step 2: Deploy Frontends to Vercel (5 minutes)

### 2.1 Deploy Admin Frontend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `vinhxuan-admin`
   - **Framework**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.railway.app` (use your Railway URL)
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Copy your admin URL (e.g., `https://vinhxuan-admin.vercel.app`)

### 2.2 Deploy User Frontend

1. Click **"Add New Project"** on Vercel
2. Import same repository again
3. Configure:
   - **Project Name**: `vinhxuan-public`
   - **Framework**: Vite
   - **Root Directory**: `apps/user-frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.railway.app`
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Copy your user URL (e.g., `https://vinhxuan-public.vercel.app`)

✅ **Frontends deployed!**

---

## 🔄 Step 3: Update CORS Settings (2 minutes)

1. Go back to **Railway Dashboard**
2. Select your **backend service**
3. Go to **"Variables"**
4. Update `CORS_ORIGIN` with your Vercel URLs:
   ```
   CORS_ORIGIN=https://vinhxuan-admin.vercel.app,https://vinhxuan-public.vercel.app
   ```
5. Railway will auto-redeploy (1-2 minutes)

---

## 🤖 Step 4: Setup GitHub Actions CI/CD (3 minutes)

### 4.1 Get Railway Token

```bash
railway login
railway whoami --token
```
Copy the token.

### 4.2 Get Vercel Tokens

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token → Copy it

**Get Project IDs:**
```bash
cd apps/frontend
vercel link
cat .vercel/project.json
# Copy orgId and projectId

cd ../user-frontend
vercel link
cat .vercel/project.json
# Copy orgId and projectId
```

### 4.3 Add GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
RAILWAY_TOKEN=<your-railway-token>
BACKEND_URL=https://your-backend.railway.app

VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID_ADMIN=<admin-project-id>
VERCEL_PROJECT_ID_USER=<user-project-id>

VITE_API_URL=https://your-backend.railway.app
```

✅ **CI/CD configured!** Push to `main` branch to auto-deploy.

---

## ✅ Verify Deployment

### Check Backend Health
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{"status":"ok","database":"connected","redis":"connected"}
```

### Check Frontends
- Visit your admin URL: `https://vinhxuan-admin.vercel.app`
- Visit your user URL: `https://vinhxuan-public.vercel.app`
- Try logging in or browsing

---

## 🎉 Done!

Your application is now live!

**Your URLs:**
- 🔧 **Admin Panel**: `https://vinhxuan-admin.vercel.app`
- 🌐 **Public Website**: `https://vinhxuan-public.vercel.app`
- ⚙️ **Backend API**: `https://your-backend.railway.app`

---

## 📚 Next Steps

1. **Custom Domain**: Add your own domain in Vercel/Railway settings
2. **Monitoring**: Check logs in Railway/Vercel dashboards
3. **Seed Data**: Run seed scripts to populate initial data
4. **Backup**: Setup automated database backups in Railway

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure database migrations ran successfully

**Frontend can't connect to backend?**
- Check `VITE_API_URL` in Vercel environment variables
- Verify CORS_ORIGIN includes your Vercel URLs
- Check browser console for errors

**Need help?**
- Check full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Review Railway/Vercel logs
- Run health check script: `./scripts/health-check.sh`

---

**Deployment completed!** 🚀
