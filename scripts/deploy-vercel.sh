#!/bin/bash

# Vercel Deployment Script for Vinh Xuan CMS Frontends

set -e

echo "▲ Starting Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

# Prompt for which frontend to deploy
echo "Which frontend do you want to deploy?"
echo "1) Admin Frontend (apps/frontend)"
echo "2) User Frontend (apps/user-frontend)"
echo "3) Both"
read -p "Enter choice [1-3]: " choice

deploy_admin() {
    echo ""
    echo "📦 Deploying Admin Frontend..."
    cd apps/frontend
    vercel --prod
    cd ../..
    echo "✅ Admin Frontend deployed!"
}

deploy_user() {
    echo ""
    echo "📦 Deploying User Frontend..."
    cd apps/user-frontend
    vercel --prod
    cd ../..
    echo "✅ User Frontend deployed!"
}

case $choice in
    1)
        deploy_admin
        ;;
    2)
        deploy_user
        ;;
    3)
        deploy_admin
        deploy_user
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify deployments at Vercel dashboard"
echo "2. Check environment variables are set correctly"
echo "3. Test the deployed applications"
