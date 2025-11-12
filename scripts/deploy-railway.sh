#!/bin/bash

# Railway Deployment Script for Vinh Xuan CMS Backend

set -e

echo "🚂 Starting Railway Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Login with: railway login"
    exit 1
fi

# Prompt for confirmation
read -p "Deploy to Railway? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo "📦 Building and deploying backend..."
railway up --service backend

echo "⏳ Waiting for deployment to complete..."
sleep 10

echo "🗄️ Running database migrations..."
railway run --service backend yarn workspace backend migration:run

echo "🔍 Checking health..."
BACKEND_URL=$(railway variables get BACKEND_URL 2>/dev/null || echo "")
if [ -n "$BACKEND_URL" ]; then
    curl -f "$BACKEND_URL/health" || echo "⚠️ Health check failed"
else
    echo "⚠️ Backend URL not found in variables"
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify deployment at Railway dashboard"
echo "2. Check logs: railway logs --service backend"
echo "3. Update Vercel frontend environment variables with backend URL"
