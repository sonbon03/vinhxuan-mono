# Vinh Xuan CMS - Backend API

Backend API for the Vinh Xuan Legal Services Content Management System.

## Tech Stack

- **Framework:** NestJS 10
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** TypeORM
- **Authentication:** JWT (Access + Refresh tokens)
- **Documentation:** Swagger/OpenAPI

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Run setup script
./scripts/setup-dev.sh

# Start backend
yarn dev
```

That's it! The script will:
- Start PostgreSQL and Redis in Docker
- Install dependencies
- Run migrations
- Set up the development environment

### Option 2: Manual Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed manual setup instructions.

## Prerequisites

- **Node.js** 20+
- **Yarn** or npm
- **Docker** (for Option 1) or:
  - **PostgreSQL** 15+ (for Option 2)
  - **Redis** 7+ (for Option 2)

## Installation

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
```

## Environment Variables

See `.env.example` for all available options. Key variables:

```env
# Application
NODE_ENV=development
PORT=8830

# Database
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=vinhxuan_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6333
REDIS_PASSWORD=

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRY=7d
```

## Development

```bash
# Start development server (with hot reload)
yarn dev

# Build for production
yarn build

# Start production server
yarn start:prod

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run e2e tests
yarn test:e2e
```

## Database Migrations

```bash
# Show migration status
yarn migration:show

# Generate migration from entity changes
yarn migration:generate src/database/migrations/MigrationName

# Create empty migration
yarn migration:create src/database/migrations/MigrationName

# Run pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert
```

## Project Structure

```
apps/backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.config.ts
│   │   └── redis.config.ts
│   ├── database/
│   │   └── migrations/      # Database migrations
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication & authorization
│   │   ├── users/          # User management
│   │   ├── employees/      # Employee management
│   │   ├── services/       # Service catalog
│   │   ├── categories/     # Categories
│   │   ├── document-groups/ # Document groups for fee types
│   │   ├── fee-types/      # Fee type management
│   │   ├── fee-calculations/ # Fee calculator
│   │   ├── records/        # Notary records
│   │   ├── articles/       # Articles/news
│   │   ├── listings/       # User listings
│   │   ├── consultations/  # Consultation scheduling
│   │   ├── email-campaigns/ # Email marketing
│   │   ├── chatbot/        # AI chatbot
│   │   └── redis/          # Redis service
│   ├── app.module.ts       # Root module
│   └── main.ts             # Application entry point
├── scripts/
│   ├── setup-dev.sh        # Development setup script
│   └── cleanup-dev.sh      # Cleanup script
├── docker-compose.yml      # Docker services configuration
├── DATABASE_SETUP.md       # Database setup guide
├── DOCKER_SETUP.md         # Docker setup guide
└── README.md              # This file
```

## API Documentation

Once the server is running, visit:

- **Swagger UI:** http://localhost:8830/api/docs
- **OpenAPI JSON:** http://localhost:8830/api/docs-json

## Available Services

### Docker Services (if using Docker)

- **PostgreSQL:** localhost:5434
- **Redis:** localhost:6333
- **pgAdmin:** http://localhost:5050 (admin@vinhxuan.com / admin)
- **Redis Commander:** http://localhost:8081

## Module Overview

### Authentication & Users
- `/api/auth` - Login, register, logout, refresh token
- `/api/users` - User management (Admin/Staff)
- `/api/employees` - Employee management (Admin)

### Services & Fees
- `/api/services` - Service catalog
- `/api/categories` - Categories for articles/records/listings
- `/api/document-groups` - Document group management
- `/api/fee-types` - Fee type configuration
- `/api/fee-calculations` - Fee calculator

### Content Management
- `/api/records` - Notary record management
- `/api/articles` - Articles and news
- `/api/listings` - User listings

### Operations
- `/api/consultations` - Consultation scheduling
- `/api/email-campaigns` - Email marketing campaigns
- `/api/chatbot` - Chatbot messaging

## Redis Features

The `RedisService` provides:

- **Token blacklisting** (for logout)
- **Session management**
- **Caching** with TTL
- **Rate limiting**
- **Counter operations**

Example usage:

```typescript
// In your service
constructor(private readonly redisService: RedisService) {}

// Cache data
await this.redisService.cache('users:list', users, 3600);

// Get cached data
const users = await this.redisService.getCached<User[]>('users:list');

// Blacklist token
await this.redisService.blacklistToken(token, 86400);

// Rate limiting
const allowed = await this.redisService.checkRateLimit(userId, 100, 60);
```

## Code Quality

```bash
# Lint code
yarn lint

# Fix lint issues
yarn lint:fix

# Format code
yarn format

# Type check
yarn typecheck
```

## Scripts

### Development Setup
```bash
./scripts/setup-dev.sh
```

### Cleanup
```bash
# Stop services (keep data)
./scripts/cleanup-dev.sh

# Stop services and remove data
./scripts/cleanup-dev.sh --remove-data
```

## Common Tasks

### Reset Database
```bash
# Drop and recreate
yarn schema:drop
yarn migration:run
```

### Clear Redis Cache
```bash
# Using Docker
docker-compose exec redis redis-cli FLUSHALL

# Using local Redis
redis-cli -p 6333 FLUSHALL
```

### Check Service Status
```bash
# Docker services
docker-compose ps

# View logs
docker-compose logs -f

# Check PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Check Redis
docker-compose exec redis redis-cli ping
```

## Troubleshooting

### Port Already in Use

Change ports in `docker-compose.yml` or `.env` if default ports are occupied.

### Database Connection Issues

1. Check if PostgreSQL is running
2. Verify credentials in `.env`
3. Check firewall settings

### Redis Connection Issues

1. Check if Redis is running
2. Verify port in `.env`
3. Check password configuration

### Migration Issues

```bash
# Show migration status
yarn migration:show

# Revert last migration
yarn migration:revert

# Drop schema and run migrations fresh (WARNING: deletes all data)
yarn schema:drop
yarn migration:run
```

For more detailed troubleshooting, see:
- [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## Production Deployment

1. **Update environment variables** for production
2. **Disable synchronize** in TypeORM config (already done)
3. **Enable SSL** for database connections
4. **Use strong passwords** for JWT secrets
5. **Enable Redis password** authentication
6. **Run migrations** before deployment
7. **Use process manager** (PM2, systemd)
8. **Set up monitoring** (logs, metrics)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

UNLICENSED - Private project for Vinh Xuan Legal Services

## Support

For issues or questions, contact the development team.
