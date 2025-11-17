# Database Migrations Guide

## Cấu trúc thư mục

```
database/
├── migrations/          # Migration files (auto-generated)
│   └── .gitkeep
├── seeds/              # Seed data scripts
│   └── run-seeds.ts
└── scripts/            # Migration management scripts
    ├── generate-migration.ts
    └── run-migrations.ts
```

## Quy trình làm việc với Migrations

### 1. Tạo Migration mới

Khi bạn thay đổi entity (thêm/sửa/xóa fields), chạy lệnh sau để tạo migration:

```bash
npm run migration:generate <TenMigration>
```

**Ví dụ:**
```bash
npm run migration:generate AddPhoneToUser
npm run migration:generate CreateEmployeeTable
npm run migration:generate UpdateServicePricing
```

Migration file sẽ được tạo trong thư mục `src/database/migrations/` với format:
```
<timestamp>-<TenMigration>.ts
```

### 2. Chạy Migrations

Để áp dụng tất cả migrations chưa chạy vào database:

```bash
npm run migration:run
```

### 3. Revert Migration

Để rollback migration gần nhất:

```bash
npm run migration:revert
```

### 4. Xem trạng thái Migrations

```bash
npm run migration:show
```

## Lưu ý quan trọng

1. **LUÔN tắt `synchronize` trong production:**
   - File `database.config.ts` đã được cấu hình `synchronize: false`
   - Chỉ sử dụng migrations để cập nhật schema

2. **Kiểm tra migration trước khi chạy:**
   - Mở file migration trong `src/database/migrations/`
   - Review SQL queries trong methods `up()` và `down()`
   - Đảm bảo logic rollback (`down()`) chính xác

3. **Thứ tự migrations:**
   - Migrations được chạy theo thứ tự timestamp
   - Không xóa hoặc sửa migrations đã chạy trên production

4. **Git workflow:**
   - Commit migration files vào Git
   - Team members chạy `npm run migration:run` sau khi pull code

## Ví dụ Migration File

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToUser1731244716000 implements MigrationInterface {
    name = 'AddPhoneToUser1731244716000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }
}
```

## Troubleshooting

**Problem:** Migration không detect changes
**Solution:** 
- Kiểm tra entity có được import đúng không
- Chạy `npm run typecheck` để kiểm tra lỗi TypeScript
- Đảm bảo database connection string đúng

**Problem:** Migration conflict
**Solution:**
- Pull code mới nhất từ Git
- Chạy `npm run migration:show` để xem trạng thái
- Chạy `npm run migration:run` để sync

**Problem:** Cần rollback nhiều migrations
**Solution:**
```bash
# Rollback từng migration một
npm run migration:revert  # Lần 1
npm run migration:revert  # Lần 2
# ... và cứ thế
```

## Best Practices

1. **Naming conventions:**
   - Sử dụng PascalCase: `CreateUserTable`, `AddEmailIndex`
   - Mô tả rõ ràng: `AddStatusToArticle` thay vì `UpdateArticle`

2. **Testing:**
   - Test migration trên local trước
   - Test rollback (`down()`) để đảm bảo có thể revert
   - Backup database trước khi chạy migration trên production

3. **Data migrations:**
   - Nếu cần migrate data, viết logic trong migration
   - Xử lý cẩn thận với dữ liệu lớn
   - Có thể chia nhỏ thành nhiều migrations

4. **Performance:**
   - Thêm indexes trong migration nếu cần
   - Chú ý đến thời gian chạy với bảng lớn
   - Có thể cần maintenance window cho migrations phức tạp
