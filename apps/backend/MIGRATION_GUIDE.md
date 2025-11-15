# Database Migration Guide

This guide explains how to work with TypeORM migrations in the VinhXuan CMS backend.

## Overview

The project uses TypeORM migrations to manage database schema changes in a version-controlled way. Migrations are stored in `src/database/migrations/` and tracked in the `migrations_history` table.

## Available Commands

### 1. Generate Migration

Creates a new migration file by comparing your entities with the current database schema:

```bash
npm run migration:generate -- MigrationName
```

**Example:**
```bash
npm run migration:generate -- AddUserPhoneField
```

**What it does:**
- Compares TypeORM entities (`*.entity.ts`) with the current database schema
- Generates SQL queries for the differences (up and down migrations)
- Creates a timestamped migration file in `src/database/migrations/`
- File format: `{timestamp}-{MigrationName}.ts`

**Note:** If no changes are detected, it will display:
```
No changes in database schema were found - cannot generate a migration.
```

### 2. Run Migrations

Executes all pending migrations:

```bash
npm run migration:run
```

**What it does:**
- Checks the `migrations_history` table for already-executed migrations
- Runs all pending migrations in chronological order
- Updates the `migrations_history` table
- Wraps all migrations in a transaction (all or nothing)

**Output examples:**
```
No pending migrations found.
```

Or if migrations were executed:
```
Successfully executed 2 migrations:
  - AddUserPhoneField1731244716000
  - UpdateArticleStatus1731244816000
```

### 3. Other Useful Commands

**Schema Sync (Development Only):**
```bash
npm run schema:sync
```
⚠️ **Warning:** This will auto-synchronize your database schema. Only use in development!

**Schema Drop (Dangerous):**
```bash
npm run schema:drop
```
⚠️ **Warning:** This will drop all tables! Use with extreme caution!

**Run Seeders:**
```bash
npm run seed:run
```
Populates the database with initial data (admin user, test data, etc.)

## Migration Workflow

### Step 1: Modify Entity

Edit or create an entity file (e.g., `src/modules/users/entities/user.entity.ts`):

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // New field added
  @Column({ nullable: true })
  phoneNumber: string;
}
```

### Step 2: Generate Migration

```bash
npm run migration:generate -- AddPhoneNumberToUser
```

This creates: `src/database/migrations/1731244716000-AddPhoneNumberToUser.ts`

### Step 3: Review Migration

Open the generated file and verify the SQL:

```typescript
export class AddPhoneNumberToUser1731244716000 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1731244716000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    }
}
```

### Step 4: Run Migration

```bash
npm run migration:run
```

### Step 5: Commit to Version Control

```bash
git add src/database/migrations/
git commit -m "Add phone number field to users"
```

## Manual Migration Creation

If you need to write custom SQL (not auto-generated), create a file manually:

```typescript
// src/database/migrations/1731244716000-CustomMigration.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomMigration1731244716000 implements MigrationInterface {
    name = 'CustomMigration1731244716000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Your custom SQL here
        await queryRunner.query(`
            CREATE INDEX idx_users_email ON users(email);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse the changes
        await queryRunner.query(`
            DROP INDEX idx_users_email;
        `);
    }
}
```

## Migration Scripts Location

- **Generate script:** `src/database/scripts/generate-migration.ts`
- **Run script:** `src/database/scripts/run-migrations.ts`
- **Migrations folder:** `src/database/migrations/`

## Database Configuration

The migration scripts use the configuration from `src/config/database.config.ts`:

```typescript
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5434,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'vinhxuan_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrationsTableName: 'migrations_history',
  migrationsRun: false, // Run migrations manually
};
```

## Best Practices

### ✅ DO:

1. **Always generate migrations** when changing entity structure
2. **Review generated migrations** before running them
3. **Test migrations** on a development database first
4. **Commit migrations** to version control
5. **Run migrations** as part of your deployment process
6. **Write reversible migrations** (proper `down()` method)

### ❌ DON'T:

1. **Don't use synchronize in production** (`synchronize: false` in production)
2. **Don't edit old migrations** that have already been run
3. **Don't delete migrations** from the migrations folder
4. **Don't run schema:sync in production**
5. **Don't commit changes without migrations**

## Troubleshooting

### Issue: "No changes in database schema were found"

**Cause:** Your entities match the current database schema.

**Solution:**
- Make sure you modified the entity file correctly
- Check if the change was already applied to the database
- Verify the entity is imported in the module

### Issue: Migration fails to run

**Cause:** SQL error or invalid migration code.

**Solution:**
- Check the error message for SQL syntax errors
- Verify the database connection settings
- Make sure the database user has sufficient permissions
- Check if the migration was already partially executed

### Issue: TypeORM can't find entities

**Cause:** Path configuration issue.

**Solution:**
- Check `entities` path in `database.config.ts`
- Verify entity files have `.entity.ts` extension
- Make sure entities are properly exported

## Production Deployment

For production deployments, include migration execution in your deployment script:

```bash
#!/bin/bash
# deploy.sh

# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Run migrations
npm run migration:run

# 4. Build application
npm run build

# 5. Restart application
pm2 restart backend
```

## Docker Deployment

When using Docker, run migrations before starting the application:

```dockerfile
# In your Dockerfile or docker-compose.yml
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
```

Or use a separate migration service in docker-compose:

```yaml
services:
  migration:
    build: .
    command: npm run migration:run
    depends_on:
      - postgres
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=vinhxuan_db

  backend:
    build: .
    command: npm run start:prod
    depends_on:
      - migration
      - postgres
```

## Summary

The migration system is already set up and ready to use. The two main commands you need are:

1. **Generate migration:** `npm run migration:generate -- MigrationName`
2. **Run migrations:** `npm run migration:run`

These commands will help you manage database schema changes in a safe, version-controlled manner.
