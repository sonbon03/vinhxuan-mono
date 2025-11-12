# 📦 Vinh Xuan CMS - Deployment Overview

Complete deployment infrastructure for the Vinh Xuan CMS application.

---

## 🏗️ Deployment Architecture

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
│  │              + PostgreSQL + Redis                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Deployment Files

### Docker Configuration
- `apps/backend/Dockerfile` - Backend production Dockerfile
- `apps/frontend/Dockerfile` - Admin frontend Dockerfile
- `apps/user-frontend/Dockerfile` - User frontend Dockerfile
- `docker-compose.prod.yml` - Production Docker Compose
- `apps/frontend/nginx.conf` - Nginx config for admin frontend
- `apps/user-frontend/nginx.conf` - Nginx config for user frontend

### CI/CD Configuration
- `.github/workflows/deploy-backend.yml` - Deploy backend to Railway
- `.github/workflows/deploy-frontend.yml` - Deploy frontends to Vercel
- `.github/workflows/test.yml` - Run tests on push/PR

### Platform Configuration
- `railway.json` - Railway deployment config
- `apps/frontend/vercel.json` - Admin frontend Vercel config
- `apps/user-frontend/vercel.json` - User frontend Vercel config
- `.vercelignore` - Files to ignore in Vercel deployment

### Environment Variables
- `.env.production.example` - Production environment template
- `apps/backend/.env.example` - Backend environment template
- `apps/frontend/.env.production` - Admin frontend production env
- `apps/user-frontend/.env.production` - User frontend production env

### Deployment Scripts
- `scripts/deploy-railway.sh` - Deploy backend to Railway
- `scripts/deploy-vercel.sh` - Deploy frontends to Vercel
- `scripts/setup-env.sh` - Setup environment variables
- `scripts/health-check.sh` - Run health checks on deployed services

### Documentation
- `DEPLOYMENT.md` - Complete deployment guide
- `QUICK-DEPLOY.md` - Quick start deployment guide (15 minutes)
- `README-DEPLOY.md` - This file

---

## 🚀 Quick Deploy

**Get started in 15 minutes:**

```bash
# 1. Install CLI tools
npm install -g @railway/cli vercel

# 2. Setup environment variables
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh

# 3. Deploy to Railway (Backend)
railway login
railway link
./scripts/deploy-railway.sh

# 4. Deploy to Vercel (Frontends)
./scripts/deploy-vercel.sh

# 5. Run health checks
./scripts/health-check.sh
```

📖 **Need detailed guide?** See [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)

---

## 🔧 Platform-Specific Guides

### Railway (Backend + Database)
- **Guide**: [DEPLOYMENT.md#railway-deployment](./DEPLOYMENT.md#railway-deployment-backend)
- **Platform**: [railway.app](https://railway.app)
- **Services**: Backend API, PostgreSQL, Redis
- **Cost**: Free tier available, pay-as-you-go

### Vercel (Frontends)
- **Guide**: [DEPLOYMENT.md#vercel-deployment](./DEPLOYMENT.md#vercel-deployment-frontends)
- **Platform**: [vercel.com](https://vercel.com)
- **Services**: Admin Frontend, User Frontend
- **Cost**: Free for hobby projects

### GitHub Actions (CI/CD)
- **Guide**: [DEPLOYMENT.md#github-actions-cicd](./DEPLOYMENT.md#github-actions-cicd)
- **Workflows**: Auto-deploy on push to main branch
- **Testing**: Run tests before deployment

---

## 📊 Deployment Checklist

Use this checklist to ensure proper deployment:

### Pre-Deployment
- [ ] Code tested locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Dependencies updated
- [ ] Security review completed

### Railway Setup
- [ ] Railway account created
- [ ] Project created
- [ ] PostgreSQL service added
- [ ] Redis service added
- [ ] Backend service configured
- [ ] Environment variables set
- [ ] Dockerfile path configured
- [ ] Domain/SSL configured (if needed)

### Vercel Setup
- [ ] Vercel account created
- [ ] Admin frontend project created
- [ ] User frontend project created
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Domains configured (if needed)

### GitHub Actions
- [ ] Railway token added to secrets
- [ ] Vercel token added to secrets
- [ ] Project IDs added to secrets
- [ ] Workflows tested
- [ ] Branch protection rules set

### Post-Deployment
- [ ] Backend health check passing
- [ ] Database migrations applied
- [ ] Frontend accessible
- [ ] API connectivity verified
- [ ] CORS configured correctly
- [ ] SSL/HTTPS working
- [ ] Monitoring setup
- [ ] Backup configured
- [ ] Documentation updated

---

## 🔐 Security Checklist

- [ ] JWT secrets generated (not default values)
- [ ] Database password changed from default
- [ ] Environment variables not committed to Git
- [ ] CORS origins restricted to production URLs
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers enabled
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] File upload validation configured

---

## 📈 Monitoring & Maintenance

### Monitoring Services

**Railway:**
- Built-in metrics dashboard
- Real-time logs
- Uptime monitoring
- Resource usage alerts

**Vercel:**
- Analytics dashboard
- Real-time logs
- Performance metrics
- Build logs

### Logging

**Backend Logs:**
```bash
# Railway CLI
railway logs --service backend --tail

# Or view in Railway dashboard
```

**Frontend Logs:**
```bash
# Vercel CLI
vercel logs <deployment-url>

# Or view in Vercel dashboard
```

### Health Checks

**Automated:**
```bash
# Run health check script
./scripts/health-check.sh
```

**Manual:**
```bash
# Backend
curl https://your-backend.railway.app/health

# Admin Frontend
curl https://your-admin.vercel.app

# User Frontend
curl https://your-user.vercel.app
```

---

## 🔄 Update Deployment

### Update Backend
```bash
# Push to GitHub (auto-deploy via GitHub Actions)
git push origin main

# Or manual Railway deployment
./scripts/deploy-railway.sh
```

### Update Frontend
```bash
# Push to GitHub (auto-deploy via GitHub Actions)
git push origin main

# Or manual Vercel deployment
./scripts/deploy-vercel.sh
```

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start**
- Check Railway logs for error messages
- Verify all environment variables are set
- Ensure database connection is working
- Check if migrations were applied

**Frontend can't connect to backend**
- Verify `VITE_API_URL` in Vercel settings
- Check CORS_ORIGIN includes Vercel URLs
- Verify backend is accessible
- Check browser console for errors

**Database connection failed**
- Verify Railway database service is running
- Check database credentials
- Ensure network connectivity
- Review connection string format

**Deployment fails in GitHub Actions**
- Check GitHub Actions logs
- Verify all secrets are set
- Ensure tokens haven't expired
- Check branch permissions

### Getting Help

1. **Check logs**: Railway/Vercel dashboards
2. **Run health checks**: `./scripts/health-check.sh`
3. **Review documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Platform status**: Check Railway/Vercel status pages
5. **Community support**: Railway/Vercel Discord/forums

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)
- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 💡 Cost Estimation

### Free Tier (Development/Small Projects)

**Railway:**
- $5 credit per month (free)
- Sufficient for development/testing
- ~512MB RAM, shared CPU

**Vercel:**
- Hobby tier (free)
- Unlimited bandwidth
- 100 GB-hours execution time

**Total: $0/month** (within free tiers)

### Production (Paid Tier)

**Railway:**
- ~$10-20/month for backend + database
- Scales based on usage
- Dedicated resources

**Vercel:**
- Free for hobby (can use in production)
- Pro: $20/month (if needed)

**Total: ~$10-40/month** depending on traffic

---

## 📞 Support

For deployment support:
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Check [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) for quick start
- Run health checks: `./scripts/health-check.sh`
- Contact DevOps team or create issue in repository

---

**Last Updated:** November 12, 2025
**Version:** 1.0.0
