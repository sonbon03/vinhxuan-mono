#!/bin/bash

# Health Check Script for Vinh Xuan CMS

set -e

echo "🏥 Running Health Checks..."
echo ""

# Function to check URL
check_url() {
    local name=$1
    local url=$2

    echo -n "Checking $name... "

    if curl -sf "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Function to check URL with response
check_url_detailed() {
    local name=$1
    local url=$2

    echo "Checking $name..."
    echo "URL: $url"

    response=$(curl -sf "$url" 2>&1) || {
        echo "❌ FAILED"
        echo ""
        return 1
    }

    echo "✅ OK"
    echo "Response: $response"
    echo ""
    return 0
}

# Get URLs from environment or prompt
BACKEND_URL=${BACKEND_URL:-""}
ADMIN_URL=${ADMIN_URL:-""}
USER_URL=${USER_URL:-""}

if [ -z "$BACKEND_URL" ]; then
    read -p "Enter Backend URL (e.g., https://your-backend.railway.app): " BACKEND_URL
fi

if [ -z "$ADMIN_URL" ]; then
    read -p "Enter Admin Frontend URL (e.g., https://your-admin.vercel.app): " ADMIN_URL
fi

if [ -z "$USER_URL" ]; then
    read -p "Enter User Frontend URL (e.g., https://your-user.vercel.app): " USER_URL
fi

echo ""
echo "Running health checks..."
echo ""

# Check Backend
check_url_detailed "Backend API" "$BACKEND_URL/health"

# Check Admin Frontend
check_url "Admin Frontend" "$ADMIN_URL"

# Check User Frontend
check_url "User Frontend" "$USER_URL"

# Check Backend API endpoints
echo ""
echo "Testing Backend API endpoints..."
check_url "API Documentation" "$BACKEND_URL/api"
check_url "Services Endpoint" "$BACKEND_URL/api/services"

echo ""
echo "✅ Health checks completed!"
