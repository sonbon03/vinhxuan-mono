#!/bin/bash

# Environment Setup Script for Vinh Xuan CMS

set -e

echo "🔧 Setting up environment variables..."

# Function to generate random secret
generate_secret() {
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Create .env files from examples if they don't exist
if [ ! -f .env ]; then
    echo "Creating root .env file..."
    cp .env.example .env
fi

if [ ! -f apps/backend/.env ]; then
    echo "Creating backend .env file..."
    cp apps/backend/.env.example apps/backend/.env

    # Generate JWT secrets
    echo ""
    echo "Generating JWT secrets..."
    JWT_ACCESS_SECRET=$(generate_secret)
    JWT_REFRESH_SECRET=$(generate_secret)

    # Update .env file with generated secrets (macOS compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET/" apps/backend/.env
        sed -i '' "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" apps/backend/.env
    else
        sed -i "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET/" apps/backend/.env
        sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" apps/backend/.env
    fi

    echo "✅ JWT secrets generated and saved"
fi

if [ ! -f apps/frontend/.env ]; then
    echo "Creating frontend .env file..."
    cp apps/frontend/.env.example apps/frontend/.env
fi

if [ ! -f apps/user-frontend/.env ]; then
    echo "Creating user-frontend .env file..."
    touch apps/user-frontend/.env
    echo "VITE_API_URL=http://localhost:8830" > apps/user-frontend/.env
fi

echo ""
echo "✅ Environment setup completed!"
echo ""
echo "📝 Please update the following in your .env files:"
echo ""
echo "Backend (apps/backend/.env):"
echo "  - DB_PASSWORD: Set your PostgreSQL password"
echo "  - CORS_ORIGIN: Update with your frontend URLs"
echo ""
echo "Frontend (apps/frontend/.env):"
echo "  - VITE_API_URL: Update with your backend URL"
echo ""
echo "User Frontend (apps/user-frontend/.env):"
echo "  - VITE_API_URL: Update with your backend URL"
echo ""
echo "Generated JWT secrets are already configured in backend .env"
