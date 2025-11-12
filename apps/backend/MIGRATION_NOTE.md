# Migration Status

## Current Setup

Database is currently using **synchronize: true** in development mode to automatically create/update tables based on entities.

## Why?

The TypeORM CLI migration generator requires proper module resolution for `@shared/types` package. Until the monorepo workspace setup is fully configured with yarn workspaces, we're using synchronize for initial development.

## Next Steps

1. Set up yarn workspaces properly
2. Install dependencies with workspace support
3. Disable synchronize
4. Generate initial migration: `npm run migration:generate src/database/migrations/InitialSchema`
5. Run migration: `npm run migration:run`

## For Production

**IMPORTANT:** Never use synchronize in production! Always use migrations.

Update src/config/database.config.ts:
```typescript
synchronize: false, // Always false in production
```

Then run migrations before deploying:
```bash
npm run migration:run
```
