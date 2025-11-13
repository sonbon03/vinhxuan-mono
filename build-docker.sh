#!/bin/bash

# VinhXuan CMS Backend - Docker Build Script
# This script must be run from the vinhxuan-cms root directory

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="vinhxuan-cms-backend"
IMAGE_TAG="latest"
DOCKERFILE_PATH="apps/backend/Dockerfile"
PLATFORM="linux/amd64"

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "apps/backend" ]; then
    echo -e "${RED}Error: This script must be run from the vinhxuan-cms root directory${NC}"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}VinhXuan CMS Backend - Docker Build${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Image Name:${NC} ${IMAGE_NAME}"
echo -e "${GREEN}Image Tag:${NC} ${IMAGE_TAG}"
echo -e "${GREEN}Platform:${NC} ${PLATFORM}"
echo -e "${GREEN}Dockerfile:${NC} ${DOCKERFILE_PATH}"
echo ""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        --push)
            PUSH_IMAGE=true
            shift
            ;;
        -h|--help)
            echo "Usage: ./build-docker.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --tag TAG        Set image tag (default: latest)"
            echo "  -n, --name NAME      Set image name (default: vinhxuan-cms-backend)"
            echo "  -p, --platform PLAT  Set platform (default: linux/amd64)"
            echo "  --push               Push image to registry after build"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./build-docker.sh"
            echo "  ./build-docker.sh -t v1.0.0"
            echo "  ./build-docker.sh -n myregistry/backend -t v1.0.0 --push"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Build the image
echo -e "${BLUE}Building Docker image...${NC}"
echo ""

FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

docker buildx build \
    --platform ${PLATFORM} \
    -f ${DOCKERFILE_PATH} \
    -t ${FULL_IMAGE} \
    .

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Image:${NC} ${FULL_IMAGE}"
    echo ""

    # Push if requested
    if [ "$PUSH_IMAGE" = true ]; then
        echo -e "${BLUE}Pushing image to registry...${NC}"
        docker push ${FULL_IMAGE}

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Push successful!${NC}"
        else
            echo -e "${RED}✗ Push failed${NC}"
            exit 1
        fi
    fi

    # Show image info
    echo -e "${BLUE}Image information:${NC}"
    docker images ${IMAGE_NAME} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Build failed${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
fi
