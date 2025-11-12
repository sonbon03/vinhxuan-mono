# Database & Redis Setup Guide

## Overview

This guide explains how to set up and manage the PostgreSQL database and Redis cache for the Vinh Xuan CMS backend.

## Prerequisites

1. **PostgreSQL** installed and running on port `5434`
2. **Redis** installed and running on port `6333`
3. **Node.js** and **yarn** installed

## Environment Configuration

Create or update your `.env` file with the following configuration:

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

## PostgreSQL Setup

### 1. Install PostgreSQL

**macOS (via Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vinhxuan_db;

# Create user (if needed)
CREATE USER vinhxuan_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vinhxuan_db TO vinhxuan_user;

# Exit
\q
```

### 3. Configure PostgreSQL Port (Optional)

If you need to use port 5434 instead of the default 5432:

**Edit postgresql.conf:**
```bash
# macOS (Homebrew)
nano /usr/local/var/postgresql@15/postgresql.conf

# Linux
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Change:
```
port = 5434
```

Then restart PostgreSQL:
```bash
# macOS
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql
```

## Redis Setup

### 1. Install Redis

**macOS (via Homebrew):**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**
Download from [Redis official website](https://redis.io/download) or use WSL

### 2. Configure Redis Port (Optional)

If you need to use port 6333 instead of the default 6379:

**Edit redis.conf:**
```bash
# macOS (Homebrew)
nano /usr/local/etc/redis.conf

# Linux
sudo nano /etc/redis/redis.conf
```

Change:
```
port 6333
```

Then restart Redis:
```bash
# macOS
brew services restart redis

# Linux
sudo systemctl restart redis-server
```

### 3. Test Redis Connection

```bash
redis-cli -p 6333
> PING
PONG
> exit
```

## Database Migrations

### TypeORM Migration Commands

**Show pending migrations:**
```bash
cd apps/backend
yarn migration:show
```

**Generate a new migration (auto-generate from entity changes):**
```bash
yarn migration:generate src/database/migrations/MigrationName
```

**Create a new empty migration:**
```bash
yarn migration:create src/database/migrations/MigrationName
```

**Run pending migrations:**
```bash
yarn migration:run
```

**Revert the last migration:**
```bash
yarn migration:revert
```

**Sync schema (DEVELOPMENT ONLY - DANGEROUS):**
```bash
yarn schema:sync
```

**Drop entire schema (DANGEROUS):**
```bash
yarn schema:drop
```

### Migration Workflow

1. **Make changes to entities** (e.g., add a new column to `User` entity)

2. **Generate migration:**
   ```bash
   yarn migration:generate src/database/migrations/AddPhoneToUser
   ```

3. **Review the generated migration** in `src/database/migrations/`

4. **Run migration:**
   ```bash
   yarn migration:run
   ```

5. **If something goes wrong, revert:**
   ```bash
   yarn migration:revert
   ```

### Example Migration

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToUser1699999999999 implements MigrationInterface {
  name = 'AddPhoneToUser1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "phone"`
    );
  }
}
```

## Redis Usage in Code

The `RedisService` provides convenient methods for common operations:

### Basic Operations

```typescript
import { RedisService } from './modules/redis/redis.service';

// Inject in your service
constructor(private readonly redisService: RedisService) {}

// Set a value
await this.redisService.set('key', 'value', 3600); // TTL: 1 hour

// Get a value
const value = await this.redisService.get('key');

// Delete a value
await this.redisService.del('key');

// Check if exists
const exists = await this.redisService.exists('key');
```

### Token Blacklisting (for Logout)

```typescript
// Blacklist a token
await this.redisService.blacklistToken(token, 86400); // 24 hours

// Check if blacklisted
const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
```

### Session Management

```typescript
// Store session
await this.redisService.setSession(userId, { data: 'value' }, 86400);

// Get session
const session = await this.redisService.getSession(userId);

// Delete session
await this.redisService.deleteSession(userId);
```

### Caching

```typescript
// Cache data
await this.redisService.cache('users:list', usersData, 3600);

// Get cached data
const cachedUsers = await this.redisService.getCached<User[]>('users:list');

// Invalidate cache
await this.redisService.invalidateCache('users:list');

// Invalidate by pattern
await this.redisService.invalidateCacheByPattern('users:*');
```

### Rate Limiting

```typescript
// Check rate limit (e.g., 100 requests per minute)
const allowed = await this.redisService.checkRateLimit(
  `user:${userId}`,
  100,
  60
);

if (!allowed) {
  throw new Error('Rate limit exceeded');
}
```

## Production Considerations

### Database

1. **NEVER use `synchronize: true` in production**
   - Always use migrations

2. **Enable SSL for PostgreSQL connections**
   ```typescript
   TypeOrmModule.forRoot({
     ...dataSourceOptions,
     ssl: process.env.NODE_ENV === 'production',
   });
   ```

3. **Use connection pooling**
   ```typescript
   extra: {
     max: 20, // Maximum pool size
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   }
   ```

4. **Regular backups**
   ```bash
   # Backup
   pg_dump -U postgres vinhxuan_db > backup.sql

   # Restore
   psql -U postgres vinhxuan_db < backup.sql
   ```

### Redis

1. **Enable persistence** (edit redis.conf)
   ```
   save 900 1
   save 300 10
   save 60 10000
   appendonly yes
   ```

2. **Set maxmemory policy**
   ```
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

3. **Enable authentication**
   ```
   requirepass your_redis_password
   ```

4. **Monitor memory usage**
   ```bash
   redis-cli -p 6333
   > INFO memory
   ```

## Troubleshooting

### PostgreSQL Issues

**Connection refused:**
- Check if PostgreSQL is running: `pg_isready -p 5434`
- Check port configuration
- Check firewall settings

**Authentication failed:**
- Verify credentials in `.env`
- Check `pg_hba.conf` for authentication method

**Port already in use:**
- Change port in postgresql.conf
- Update `.env` with new port

### Redis Issues

**Connection refused:**
- Check if Redis is running: `redis-cli -p 6333 ping`
- Check port configuration
- Check firewall settings

**Out of memory:**
- Check memory usage: `redis-cli -p 6333 INFO memory`
- Clear old keys: `redis-cli -p 6333 FLUSHDB`
- Increase maxmemory in redis.conf

**Slow performance:**
- Check for slow operations: `redis-cli -p 6333 SLOWLOG GET 10`
- Monitor keyspace: `redis-cli -p 6333 INFO keyspace`

## Useful Commands

### PostgreSQL

```bash
# List all databases
psql -U postgres -l

# Connect to database
psql -U postgres -d vinhxuan_db

# List tables
\dt

# Describe table
\d table_name

# Show table size
SELECT pg_size_pretty(pg_total_relation_size('table_name'));

# Kill all connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'vinhxuan_db';
```

### Redis

```bash
# Connect
redis-cli -p 6333

# Show all keys
KEYS *

# Get key info
TYPE key_name
TTL key_name

# Memory usage
MEMORY USAGE key_name

# Delete all keys in current database
FLUSHDB

# Delete all keys in all databases
FLUSHALL

# Monitor real-time commands
MONITOR
```

## Development Workflow

1. **Start services:**
   ```bash
   # PostgreSQL
   brew services start postgresql@15

   # Redis
   brew services start redis
   ```

2. **Run migrations:**
   ```bash
   cd apps/backend
   yarn migration:run
   ```

3. **Start development server:**
   ```bash
   yarn dev
   ```

4. **Make entity changes and generate migration:**
   ```bash
   # After modifying entities
   yarn migration:generate src/database/migrations/DescriptiveName

   # Review generated migration
   # Run migration
   yarn migration:run
   ```

## Additional Resources

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [ioredis Documentation](https://github.com/redis/ioredis)
