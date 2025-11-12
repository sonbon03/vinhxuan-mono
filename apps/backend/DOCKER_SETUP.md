# Docker Setup Guide

This guide explains how to run PostgreSQL and Redis using Docker for the Vinh Xuan CMS backend.

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/get-started))
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Start All Services

```bash
cd apps/backend
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5434`
- **Redis** on port `6333`
- **pgAdmin** (PostgreSQL GUI) on port `5050`
- **Redis Commander** (Redis GUI) on port `8081`

### 2. Check Service Status

```bash
docker-compose ps
```

You should see all services running:
```
NAME                      STATUS              PORTS
vinhxuan-postgres         Up (healthy)        0.0.0.0:5434->5432/tcp
vinhxuan-redis            Up (healthy)        0.0.0.0:6333->6379/tcp
vinhxuan-pgadmin          Up                  0.0.0.0:5050->80/tcp
vinhxuan-redis-commander  Up                  0.0.0.0:8081->8081/tcp
```

### 3. Run Migrations

```bash
yarn migration:run
```

### 4. Start Backend Server

```bash
yarn dev
```

## Service Details

### PostgreSQL

- **Host:** localhost
- **Port:** 5434
- **Database:** vinhxuan_db
- **User:** postgres
- **Password:** postgres

**Connection String:**
```
postgresql://postgres:postgres@localhost:5434/vinhxuan_db
```

### Redis

- **Host:** localhost
- **Port:** 6333
- **No password** (development only)

**Test Connection:**
```bash
redis-cli -p 6333 ping
# Should return: PONG
```

### pgAdmin (PostgreSQL GUI)

Access at: http://localhost:5050

**Login:**
- Email: admin@vinhxuan.com
- Password: admin

**Connect to PostgreSQL:**
1. Right-click "Servers" → Create → Server
2. General tab: Name = "Vinh Xuan DB"
3. Connection tab:
   - Host: postgres (or host.docker.internal on Mac/Windows)
   - Port: 5432
   - Database: vinhxuan_db
   - Username: postgres
   - Password: postgres
4. Click "Save"

### Redis Commander (Redis GUI)

Access at: http://localhost:8081

No login required. You can browse all Redis keys and manage data.

## Common Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres
docker-compose up -d redis

# Start and view logs
docker-compose up
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart postgres
docker-compose restart redis
```

### Execute Commands in Containers

**PostgreSQL:**
```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d vinhxuan_db

# Run SQL file
docker-compose exec -T postgres psql -U postgres -d vinhxuan_db < backup.sql

# Backup database
docker-compose exec -T postgres pg_dump -U postgres vinhxuan_db > backup.sql
```

**Redis:**
```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Flush all data
docker-compose exec redis redis-cli FLUSHALL
```

## Data Persistence

Data is persisted using Docker volumes:
- `postgres_data` - PostgreSQL data
- `redis_data` - Redis data
- `pgadmin_data` - pgAdmin configuration

**View volumes:**
```bash
docker volume ls | grep vinhxuan
```

**Remove volumes (WARNING: deletes all data):**
```bash
docker-compose down -v
```

## Production Configuration

For production, update `docker-compose.yml`:

### PostgreSQL

```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: ${DB_PASSWORD} # Use strong password from .env
  command:
    - "postgres"
    - "-c"
    - "max_connections=200"
    - "-c"
    - "shared_buffers=256MB"
```

### Redis

```yaml
redis:
  command: >
    redis-server
    --appendonly yes
    --requirepass ${REDIS_PASSWORD} # Add password protection
    --maxmemory 256mb
    --maxmemory-policy allkeys-lru
```

## Environment Variables

Update your `.env` file to use Docker services:

```env
# Database (Docker)
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=vinhxuan_db

# Redis (Docker)
REDIS_HOST=localhost
REDIS_PORT=6333
```

## Troubleshooting

### Port Already in Use

If ports 5434 or 6333 are already in use:

**Option 1: Change Docker ports**
```yaml
services:
  postgres:
    ports:
      - '5435:5432' # Use different port

  redis:
    ports:
      - '6334:6379' # Use different port
```

**Option 2: Stop conflicting services**
```bash
# Stop local PostgreSQL
brew services stop postgresql

# Stop local Redis
brew services stop redis
```

### Services Won't Start

```bash
# Check container logs
docker-compose logs postgres
docker-compose logs redis

# Remove and recreate containers
docker-compose down
docker-compose up -d
```

### Connection Refused

**From host machine:**
- Use `localhost` or `127.0.0.1`
- Ensure containers are running: `docker-compose ps`

**From another container:**
- Use service name: `postgres` or `redis`
- Ensure containers are on same network

### Data Corruption

```bash
# Stop services
docker-compose down

# Remove corrupted volumes
docker volume rm backend_postgres_data
docker volume rm backend_redis_data

# Recreate
docker-compose up -d

# Run migrations
yarn migration:run
```

## Development Workflow

### Daily Development

```bash
# 1. Start services
docker-compose up -d

# 2. Check health
docker-compose ps

# 3. Run migrations (if needed)
yarn migration:run

# 4. Start backend
yarn dev

# 5. When done (optional - containers can stay running)
docker-compose stop
```

### Reset Database

```bash
# Option 1: Drop and recreate (keeps migrations)
docker-compose exec postgres psql -U postgres -c "DROP DATABASE vinhxuan_db;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE vinhxuan_db;"
yarn migration:run

# Option 2: Use TypeORM (dangerous - drops all tables)
yarn schema:drop
yarn migration:run
```

### Reset Redis

```bash
# Clear all Redis data
docker-compose exec redis redis-cli FLUSHALL
```

## Performance Optimization

### PostgreSQL

```yaml
postgres:
  command:
    - "postgres"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "effective_cache_size=1GB"
    - "-c"
    - "maintenance_work_mem=64MB"
    - "-c"
    - "checkpoint_completion_target=0.9"
    - "-c"
    - "wal_buffers=16MB"
    - "-c"
    - "default_statistics_target=100"
    - "-c"
    - "random_page_cost=1.1"
    - "-c"
    - "effective_io_concurrency=200"
    - "-c"
    - "work_mem=4MB"
    - "-c"
    - "min_wal_size=1GB"
    - "-c"
    - "max_wal_size=4GB"
```

### Redis

```yaml
redis:
  command: >
    redis-server
    --appendonly yes
    --maxmemory 512mb
    --maxmemory-policy allkeys-lru
    --tcp-backlog 511
    --timeout 300
    --tcp-keepalive 60
```

## Monitoring

### PostgreSQL Stats

```bash
# Connection count
docker-compose exec postgres psql -U postgres -d vinhxuan_db -c "SELECT count(*) FROM pg_stat_activity;"

# Database size
docker-compose exec postgres psql -U postgres -d vinhxuan_db -c "SELECT pg_size_pretty(pg_database_size('vinhxuan_db'));"

# Table sizes
docker-compose exec postgres psql -U postgres -d vinhxuan_db -c "
  SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
"
```

### Redis Stats

```bash
# Memory usage
docker-compose exec redis redis-cli INFO memory

# Key count
docker-compose exec redis redis-cli DBSIZE

# Slow log
docker-compose exec redis redis-cli SLOWLOG GET 10
```

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [pgAdmin Docker Image](https://hub.docker.com/r/dpage/pgadmin4)
- [Redis Commander](https://github.com/joeferner/redis-commander)
