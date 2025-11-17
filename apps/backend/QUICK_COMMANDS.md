# 🎯 Quick Commands Reference

## 🗂️ Migration Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run migration:generate <Name>` | Tạo migration mới | `npm run migration:generate AddPhone` |
| `npm run migration:run` | Chạy tất cả migrations pending | `npm run migration:run` |
| `npm run migration:revert` | Rollback migration gần nhất | `npm run migration:revert` |
| `npm run migration:show` | Xem trạng thái migrations | `npm run migration:show` |

## 🚀 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with ts-node |
| `npm run dev:watch` | Start with nodemon auto-reload |
| `npm run build` | Build production code |
| `npm run start:prod` | Run production build |

## 🧪 Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |

## 🔍 Code Quality Commands

| Command | Description |
|---------|-------------|
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `npm run seed:run` | Run database seeds |
| `npm run schema:sync` | Sync schema (⚠️ dev only) |
| `npm run schema:drop` | Drop all tables (⚠️ dangerous) |

## 🔐 Security Commands

| Command | Description |
|---------|-------------|
| `npm run keys:generate` | Generate RSA keys for JWT |

---

## 📋 Common Workflows

### 1. Start Fresh Development
```bash
git pull
npm install
npm run migration:run
npm run seed:run
npm run dev
```

### 2. Add New Feature with Migration
```bash
# 1. Create/modify entity
# 2. Generate migration
npm run migration:generate FeatureName
# 3. Review migration file
# 4. Run migration
npm run migration:run
# 5. Test
npm run dev
```

### 3. Deploy to Production
```bash
npm run typecheck
npm run lint
npm run test
npm run build
# On server:
npm run migration:run
npm run start:prod
```

### 4. Fix Migration Error
```bash
npm run migration:revert  # Rollback
# Fix entity/migration
npm run migration:generate FixedMigration
npm run migration:run
```

---

## 🎨 File Locations

| What | Where |
|------|-------|
| Migrations | `src/database/migrations/*.ts` |
| Entities | `src/modules/**/*.entity.ts` |
| Seeds | `src/database/seeds/*.ts` |
| Config | `src/config/*.ts` |
| Environment | `.env` |

---

**💡 Tips:**
- Always run `migration:show` before `migration:run` to see what will be executed
- Review generated migrations before applying them
- Keep backup before running migrations on production
- Use meaningful migration names

