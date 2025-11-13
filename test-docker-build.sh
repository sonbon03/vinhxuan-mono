#!/bin/bash

# Test Docker Build Script for Railway Deployment
# This script tests the Docker build locally before deploying to Railway

set -e  # Exit on error

echo "🔨 Testing Vinh Xuan Backend Docker Build..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to the correct directory (script should be run from vinhxuan-cms root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📁 Current directory: $(pwd)${NC}"
echo ""

# Check if Dockerfile exists
if [ ! -f "apps/backend/Dockerfile" ]; then
    echo -e "${RED}❌ Error: apps/backend/Dockerfile not found${NC}"
    echo "Make sure you're running this script from the vinhxuan-cms root directory"
    exit 1
fi

echo -e "${BLUE}Step 1: Building Docker image...${NC}"
echo "This mimics Railway's build process"
echo ""

# Build the Docker image (same way Railway does it)
docker build \
    -f apps/backend/Dockerfile \
    -t vinhxuan-backend:test \
    . \
    || {
        echo -e "${RED}❌ Docker build failed!${NC}"
        echo "Check the error messages above for details"
        exit 1
    }

echo ""
echo -e "${GREEN}✅ Docker build completed successfully!${NC}"
echo ""

# Check image size
IMAGE_SIZE=$(docker images vinhxuan-backend:test --format "{{.Size}}")
echo -e "${BLUE}📦 Image size: ${IMAGE_SIZE}${NC}"
echo ""

# Ask if user wants to run the container
echo -e "${YELLOW}Do you want to test run the container? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${BLUE}Step 2: Starting container...${NC}"
    echo "Note: This will fail without proper environment variables (DATABASE_URL, REDIS_URL)"
    echo "But we can verify the container starts and check the health endpoint"
    echo ""

    # Run the container with basic env vars
    docker run -d \
        --name vinhxuan-backend-test \
        -p 8830:8830 \
        -e NODE_ENV=production \
        -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
        -e REDIS_URL=redis://localhost:6379 \
        vinhxuan-backend:test \
        || {
            echo -e "${RED}❌ Container failed to start${NC}"
            docker logs vinhxuan-backend-test 2>&1 | tail -20
            docker rm -f vinhxuan-backend-test 2>/dev/null || true
            exit 1
        }

    echo ""
    echo -e "${BLUE}Waiting for container to start...${NC}"
    sleep 5

    # Show logs
    echo ""
    echo -e "${BLUE}Container logs:${NC}"
    docker logs vinhxuan-backend-test 2>&1 | tail -30

    # Try to hit health endpoint
    echo ""
    echo -e "${BLUE}Testing health endpoint...${NC}"

    # Check if container is still running
    if docker ps | grep -q vinhxuan-backend-test; then
        echo -e "${GREEN}✅ Container is running${NC}"

        # Try health check
        if curl -f http://localhost:8830/health 2>/dev/null; then
            echo ""
            echo -e "${GREEN}✅ Health check passed!${NC}"
        else
            echo ""
            echo -e "${YELLOW}⚠️  Health check failed (expected if DB/Redis not available)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Container exited (expected if DB/Redis not available)${NC}"
    fi

    echo ""
    echo -e "${BLUE}Cleaning up...${NC}"
    docker stop vinhxuan-backend-test 2>/dev/null || true
    docker rm vinhxuan-backend-test 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}✅ Docker build test completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. If build succeeded, you can deploy to Railway"
echo "2. Make sure environment variables are set in Railway dashboard"
echo "3. Push changes to trigger Railway deployment"
echo ""
echo -e "${BLUE}To manually push and deploy:${NC}"
echo "  git add ."
echo "  git commit -m 'Fix Railway deployment'"
echo "  git push origin main"
echo ""
echo -e "${BLUE}To clean up Docker image:${NC}"
echo "  docker rmi vinhxuan-backend:test"
echo ""
