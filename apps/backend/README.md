# 🏢 Vinh Xuan CMS - Backend API

NestJS Backend application cho hệ thống quản lý dịch vụ công chứng Vinh Xuân.

## 📚 Quick Links

- 📖 [Migration Guide](./MIGRATION_GUIDE.md) - Hướng dẫn chi tiết về migrations
- ⚡ [Quick Commands](./QUICK_COMMANDS.md) - Tham chiếu nhanh các lệnh
- ✅ [Setup Summary](./SETUP_SUMMARY.md) - Tổng kết cấu hình hệ thống
- 🗄️ [Database README](./src/database/README.md) - Chi tiết về database
- 🔐 [JWT Setup](./JWT-SETUP.md) - Cấu hình JWT với RSA256
- 🐳 [Docker Setup](./DOCKER_SETUP.md) - Docker configuration

## 🚀 Quick Start

### 1. Cài đặt
```bash
npm install
```

### 2. Cấu hình môi trường
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

### 3. Chạy migrations
```bash
npm run migration:run
```

### 4. Seed database (optional)
```bash
npm run seed:run
```

### 5. Start development server
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:8830

## 🛠️ Tech Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL 14+ (Port 5434)
- **Cache:** Redis 6+ (Port 6333)
- **ORM:** TypeORM
- **Authentication:** JWT with RSA256
- **Language:** TypeScript 5.1+

## 📋 Available Scripts

### Development
```bash
npm run dev              # Start với ts-node
npm run dev:watch        # Start với nodemon auto-reload
npm run build            # Build production
npm run start:prod       # Run production build
```

### Migrations
```bash
npm run migration:generate <Name>  # Tạo migration mới
npm run migration:run              # Chạy migrations
npm run migration:revert           # Rollback migration
npm run migration:show             # Xem trạng thái
```

### Testing
```bash
npm run test             # Unit tests
npm run test:watch       # Watch mode
npm run test:cov         # Coverage
npm run test:e2e         # E2E tests
```

### Code Quality
```bash
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix
npm run format           # Prettier format
npm run typecheck        # TypeScript check
```

## 🗄️ Database

### Configuration
- **Host:** localhost
- **Port:** 5434
- **Database:** vinhxuan_db
- **User:** postgres

### Migrations Location
Tất cả migrations được lưu tại: `src/database/migrations/`

### Migration Workflow
1. Sửa/tạo entity
2. `npm run migration:generate <Name>`
3. Review file migration
4. `npm run migration:run`

Chi tiết xem [Migration Guide](./MIGRATION_GUIDE.md)

## 📁 Project Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication
│   ├── users/           # User management
│   ├── employees/       # Employee management
│   ├── services/        # Service management
│   ├── fee-types/       # Fee type management
│   ├── records/         # Record management
│   └── ...
├── common/              # Shared modules
│   ├── guards/          # Auth guards
│   ├── decorators/      # Custom decorators
│   └── filters/         # Exception filters
├── config/              # Configuration
│   └── database.config.ts
└── database/            # Database related
    ├── migrations/      # Migration files
    ├── scripts/         # Migration scripts
    └── seeds/           # Seed data
```

## 🔐 Environment Variables

```env
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
JWT_ACCESS_TOKEN_EXPIRY=1d
JWT_REFRESH_TOKEN_EXPIRY=7d

# Server
PORT=8830
NODE_ENV=development
```

## 📖 API Documentation

Sau khi start server, truy cập Swagger UI tại:
```
http://localhost:8830/api/docs
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚢 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Migration in Production
```bash
# Backup database first!
npm run migration:run
```

## 🐛 Troubleshooting

### Migration không detect changes
```bash
npm run typecheck  # Check TypeScript errors
```

### Database connection error
- Kiểm tra PostgreSQL đang chạy
- Verify `.env` configuration
- Check port 5434 không bị chiếm

### Redis connection error
- Kiểm tra Redis đang chạy
- Check port 6333

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 👥 Team

Vinh Xuan Legal Services Team

## 📄 License

UNLICENSED - Private Project

---

**Made with ❤️ by Vinh Xuan Team**
