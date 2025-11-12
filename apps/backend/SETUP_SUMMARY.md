# Backend Setup Summary

## ✅ What Was Configured

### 1. Redis Configuration

**Files Created:**
- `src/config/redis.config.ts` - Redis client configuration with retry strategy
- `src/modules/redis/redis.module.ts` - Global Redis module
- `src/modules/redis/redis.service.ts` - Comprehensive Redis service

**Features Implemented:**
- ✅ Connection with retry mechanism
- ✅ Password authentication support
- ✅ Token blacklisting (for logout)
- ✅ Session management
- ✅ Caching with TTL
- ✅ Rate limiting
- ✅ Counter operations
- ✅ Pattern-based cache invalidation

**Environment Variables:**
```env
REDIS_HOST=localhost
REDIS_PORT=6333
REDIS_PASSWORD=
```

### 2. Database Configuration

**Files Created:**
- `src/config/database.config.ts` - TypeORM DataSource configuration for migrations
- `src/database/migrations/.gitkeep` - Migrations directory placeholder

**Configuration:**
- ✅ PostgreSQL connection with TypeORM
- ✅ Migration support enabled
- ✅ Synchronize disabled (safe for production)
- ✅ Migration history tracking
- ✅ Development logging enabled

**Environment Variables:**
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=vinhxuan_db
```

### 3. Migration Scripts

**Updated package.json with:**
```bash
yarn typeorm                 # TypeORM CLI
yarn migration:generate      # Generate migration from entities
yarn migration:create        # Create empty migration
yarn migration:run          # Run pending migrations
yarn migration:revert       # Revert last migration
yarn migration:show         # Show migration status
yarn schema:sync           # Sync schema (dev only)
yarn schema:drop           # Drop schema (dangerous)
```

### 4. Docker Setup

**Files Created:**
- `docker-compose.yml` - PostgreSQL, Redis, pgAdmin, Redis Commander
- `DOCKER_SETUP.md` - Comprehensive Docker guide

**Services Included:**
- **PostgreSQL 15** - Port 5434
- **Redis 7** - Port 6333
- **pgAdmin** - Port 5050 (Web UI for PostgreSQL)
- **Redis Commander** - Port 8081 (Web UI for Redis)

**Features:**
- ✅ Health checks for all services
- ✅ Data persistence with volumes
- ✅ Production-ready configuration examples
- ✅ Network isolation

### 5. Setup Scripts

**Files Created:**
- `scripts/setup-dev.sh` - Automated development setup
- `scripts/cleanup-dev.sh` - Cleanup script with data removal option

**Features:**
- ✅ Automatic Docker installation check
- ✅ .env file creation
- ✅ Service health verification
- ✅ Dependency installation
- ✅ Migration execution
- ✅ Interactive cleanup

### 6. Documentation

**Files Created:**
- `DATABASE_SETUP.md` - Comprehensive database and Redis setup guide
- `DOCKER_SETUP.md` - Detailed Docker usage guide
- `README.md` - Main backend documentation
- `SETUP_SUMMARY.md` - This file

### 7. App Module Integration

**Updated:**
- `src/app.module.ts` - Integrated RedisModule and dataSourceOptions

**Changes:**
- ✅ RedisModule imported as global module
- ✅ TypeORM configured with dataSourceOptions
- ✅ Synchronize disabled for safety

## 🚀 Quick Start

### For First-Time Setup

```bash
# Navigate to backend
cd apps/backend

# Run setup script
./scripts/setup-dev.sh

# Start backend
yarn dev
```

### Daily Development

```bash
# Start Docker services (if stopped)
docker-compose up -d

# Start backend
yarn dev
```

## 📊 Available Services

Once running, you can access:

| Service | URL/Connection | Credentials |
|---------|---------------|-------------|
| Backend API | http://localhost:8830 | N/A |
| Swagger Docs | http://localhost:8830/api/docs | N/A |
| PostgreSQL | localhost:5434 | postgres/postgres |
| Redis | localhost:6333 | No password |
| pgAdmin | http://localhost:5050 | admin@vinhxuan.com / admin |
| Redis Commander | http://localhost:8081 | No login |

## 📝 Common Tasks

### Database Migrations

```bash
# Check migration status
yarn migration:show

# Generate migration from entity changes
yarn migration:generate src/database/migrations/AddNewField

# Run migrations
yarn migration:run

# Revert last migration
yarn migration:revert
```

### Redis Operations

```bash
# Check Redis connection
docker-compose exec redis redis-cli ping

# View all keys
docker-compose exec redis redis-cli KEYS '*'

# Clear all data
docker-compose exec redis redis-cli FLUSHALL

# Monitor real-time
docker-compose exec redis redis-cli MONITOR
```

### Docker Management

```bash
# View service status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services (keep data)
docker-compose down

# Stop and remove data
./scripts/cleanup-dev.sh --remove-data
```

## 🔧 Configuration Files

### Environment Variables (.env)

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
JWT_ACCESS_SECRET=your_access_secret_key_change_in_production
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

## 💡 Using Redis in Your Code

### Inject RedisService

```typescript
import { RedisService } from './modules/redis/redis.service';

constructor(private readonly redisService: RedisService) {}
```

### Cache Data

```typescript
// Cache with 1 hour TTL
await this.redisService.cache('users:list', users, 3600);

// Get cached data
const users = await this.redisService.getCached<User[]>('users:list');

// Invalidate cache
await this.redisService.invalidateCache('users:list');

// Invalidate by pattern
await this.redisService.invalidateCacheByPattern('users:*');
```

### Token Blacklisting

```typescript
// Blacklist token (for logout)
await this.redisService.blacklistToken(refreshToken, 604800); // 7 days

// Check if blacklisted
const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
```

### Session Management

```typescript
// Store session
await this.redisService.setSession(userId, sessionData, 86400); // 24 hours

// Get session
const session = await this.redisService.getSession(userId);

// Delete session
await this.redisService.deleteSession(userId);
```

### Rate Limiting

```typescript
// Check rate limit (100 requests per minute)
const allowed = await this.redisService.checkRateLimit(
  `api:${userId}`,
  100,
  60
);

if (!allowed) {
  throw new HttpException('Rate limit exceeded', 429);
}
```

## 🔒 Security Best Practices

### For Development

- ✅ Use Docker for isolated services
- ✅ Keep .env file private (already in .gitignore)
- ✅ Use default passwords for local development

### For Production

- ⚠️ **NEVER use synchronize: true**
- ⚠️ **Change all default passwords**
- ⚠️ **Use strong JWT secrets**
- ⚠️ **Enable Redis password authentication**
- ⚠️ **Enable SSL for PostgreSQL**
- ⚠️ **Use environment-specific .env files**
- ⚠️ **Set up proper firewall rules**
- ⚠️ **Enable Redis persistence**

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| README.md | Main backend documentation |
| DATABASE_SETUP.md | Detailed database and Redis setup |
| DOCKER_SETUP.md | Docker usage and troubleshooting |
| SETUP_SUMMARY.md | This quick reference guide |

## 🆘 Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -i :5434  # PostgreSQL
lsof -i :6333  # Redis

# View Docker logs
docker-compose logs postgres
docker-compose logs redis
```

### Migration Errors

```bash
# Check migration status
yarn migration:show

# Revert if needed
yarn migration:revert

# Drop and recreate (WARNING: deletes data)
yarn schema:drop
yarn migration:run
```

### Redis Connection Issues

```bash
# Test connection
docker-compose exec redis redis-cli ping

# Check if running
docker-compose ps redis

# Restart Redis
docker-compose restart redis
```

### PostgreSQL Connection Issues

```bash
# Test connection
docker-compose exec postgres pg_isready -U postgres

# Check if running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Docker services are running: `docker-compose ps`
- [ ] PostgreSQL is accessible: `docker-compose exec postgres pg_isready -U postgres`
- [ ] Redis is accessible: `docker-compose exec redis redis-cli ping`
- [ ] Migrations run successfully: `yarn migration:run`
- [ ] Backend starts without errors: `yarn dev`
- [ ] Swagger docs are accessible: http://localhost:8830/api/docs
- [ ] pgAdmin is accessible: http://localhost:5050
- [ ] Redis Commander is accessible: http://localhost:8081

## 🎉 Next Steps

1. **Review the documentation** - Read DATABASE_SETUP.md and DOCKER_SETUP.md
2. **Create initial migrations** - Generate migrations from your entities
3. **Test Redis integration** - Try caching and session management
4. **Configure production settings** - Update .env for production
5. **Set up CI/CD** - Integrate migrations into deployment pipeline

## 📞 Support

For issues or questions:
- Check the troubleshooting sections in documentation
- Review Docker logs: `docker-compose logs -f`
- Contact the development team

---

**Setup completed on:** November 10, 2025
**Version:** 1.0.0
