#!/bin/bash

# Vinh Xuan CMS Backend - Development Setup Script
# This script sets up the development environment with Docker

set -e

echo "🚀 Vinh Xuan CMS Backend - Development Setup"
echo "=============================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check PostgreSQL health
echo "🔍 Checking PostgreSQL..."
docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1 && echo "✅ PostgreSQL is ready" || echo "⚠️  PostgreSQL may need more time"

# Check Redis health
echo "🔍 Checking Redis..."
docker-compose exec -T redis redis-cli ping > /dev/null 2>&1 && echo "✅ Redis is ready" || echo "⚠️  Redis may need more time"

echo ""
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

echo ""
echo "🗄️  Running database migrations..."
if command -v yarn &> /dev/null; then
    yarn migration:run || echo "⚠️  No migrations to run or migration failed"
else
    npm run migration:run || echo "⚠️  No migrations to run or migration failed"
fi

echo ""
echo "=============================================="
echo "✅ Development environment is ready!"
echo ""
echo "📊 Services:"
echo "   - PostgreSQL: localhost:5434"
echo "   - Redis: localhost:6333"
echo "   - pgAdmin: http://localhost:5050"
echo "   - Redis Commander: http://localhost:8081"
echo ""
echo "🚀 Next steps:"
echo "   1. Update .env with your configuration (if needed)"
echo "   2. Run 'yarn dev' or 'npm run dev' to start the backend"
echo ""
echo "📖 Documentation:"
echo "   - DATABASE_SETUP.md - Database and Redis setup"
echo "   - DOCKER_SETUP.md - Docker usage guide"
echo ""
echo "🛠️  Useful commands:"
echo "   - docker-compose ps          # Check service status"
echo "   - docker-compose logs -f     # View logs"
echo "   - docker-compose down        # Stop services"
echo "   - yarn migration:generate    # Generate migration"
echo "   - yarn migration:run         # Run migrations"
echo "=============================================="
