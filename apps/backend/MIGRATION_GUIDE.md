# 🚀 Migration Quick Start Guide

## 📁 Cấu trúc Migration

Các file migration được lưu tại: `src/database/migrations/`

```
src/database/migrations/
├── .gitkeep
└── 1731244716000-InitialSchema.ts  (migration đầu tiên)
```

## 🔧 Các lệnh quan trọng

### 1️⃣ Tạo Migration mới
```bash
npm run migration:generate <TenMigration>
```

**Ví dụ:**
```bash
npm run migration:generate AddPhoneToUser
npm run migration:generate CreateEmployeeTable
npm run migration:generate UpdateServicePricing
```

✅ File migration sẽ được tạo tự động trong `src/database/migrations/` với format:
```
<timestamp>-<TenMigration>.ts
```

### 2️⃣ Chạy Migrations (Apply vào database)
```bash
npm run migration:run
```

### 3️⃣ Rollback Migration (Hoàn tác)
```bash
npm run migration:revert
```
**Lưu ý:** Chỉ rollback được 1 migration gần nhất. Muốn rollback nhiều migrations thì phải chạy lệnh này nhiều lần.

### 4️⃣ Xem trạng thái Migrations
```bash
npm run migration:show
```

Kết quả sẽ hiển thị:
- ✅ `[X]` - Đã chạy
- ⏳ `[ ]` - Chưa chạy

## 📝 Quy trình làm việc thực tế

### Scenario 1: Thêm field mới vào Entity

**Bước 1:** Sửa Entity (ví dụ: User entity)
```typescript
// src/modules/users/entities/user.entity.ts
@Entity('users')
export class User {
  // ... existing fields ...
  
  @Column({ nullable: true })
  phone: string; // ➕ Thêm field mới
}
```

**Bước 2:** Generate migration
```bash
npm run migration:generate AddPhoneToUser
```

**Bước 3:** Kiểm tra file migration vừa tạo
```bash
ls -la src/database/migrations/
```

**Bước 4:** Review migration file
```typescript
// src/database/migrations/1731244716000-AddPhoneToUser.ts
export class AddPhoneToUser1731244716000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }
}
```

**Bước 5:** Apply migration
```bash
npm run migration:run
```

### Scenario 2: Tạo Entity mới hoàn toàn

**Bước 1:** Tạo Entity mới
```typescript
// src/modules/products/entities/product.entity.ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
}
```

**Bước 2:** Generate migration
```bash
npm run migration:generate CreateProductTable
```

**Bước 3:** Apply migration
```bash
npm run migration:run
```

### Scenario 3: Rollback khi có lỗi

**Trường hợp:** Migration vừa chạy gây lỗi hoặc sai logic

```bash
# Rollback migration gần nhất
npm run migration:revert
```

**Sau đó:**
1. Sửa lại Entity
2. Xóa file migration cũ (nếu cần)
3. Generate migration mới
4. Chạy lại migration

## ⚠️ Lưu ý quan trọng

### ✅ DO (Nên làm)
- ✅ Luôn review file migration trước khi chạy
- ✅ Test migration trên local trước khi deploy
- ✅ Commit migration files vào Git
- ✅ Sử dụng tên migration có ý nghĩa (AddPhoneToUser, CreateProductTable...)
- ✅ Kiểm tra method `down()` để đảm bảo có thể rollback
- ✅ Backup database trước khi chạy migration trên production

### ❌ DON'T (Không nên làm)
- ❌ Không sửa migration đã chạy trên production
- ❌ Không xóa migration đã commit
- ❌ Không sử dụng `synchronize: true` trong production
- ❌ Không skip migration khi pull code mới
- ❌ Không chạy migration trực tiếp trên production mà không backup

## 🔍 Troubleshooting

### Problem 1: "No changes in database schema were found"

**Nguyên nhân:** Entity đã sync với database rồi, không có thay đổi

**Giải pháp:**
- Kiểm tra lại entity có thay đổi không
- Chạy `npm run typecheck` để kiểm tra lỗi TypeScript
- Restart backend server nếu cần

### Problem 2: Migration conflict

**Nguyên nhân:** Có người khác đã tạo migration

**Giải pháp:**
```bash
git pull origin main
npm run migration:run
```

### Problem 3: Migration fail

**Nguyên nhân:** SQL lỗi hoặc constraint violation

**Giải pháp:**
```bash
# Rollback
npm run migration:revert

# Sửa lại entity và generate lại
npm run migration:generate FixedMigration
```

## 📊 Best Practices

### 1. Naming Convention
```bash
# Good ✅
npm run migration:generate AddEmailToUser
npm run migration:generate CreateProductTable
npm run migration:generate UpdateServicePricing
npm run migration:generate AddIndexToUserEmail

# Bad ❌
npm run migration:generate Update
npm run migration:generate Fix
npm run migration:generate Changes
```

### 2. Migration Size
- Chia nhỏ migrations
- Mỗi migration nên focus vào 1 thay đổi cụ thể
- Tránh migration quá lớn và phức tạp

### 3. Data Migration
- Nếu cần migrate data, viết logic trong migration
- Test kỹ trên local với data thật
- Có backup plan

### 4. Team Workflow
```bash
# Developer A
git checkout -b feature/add-phone
# Sửa entity và tạo migration
npm run migration:generate AddPhone
git add .
git commit -m "feat: add phone field to user"
git push

# Developer B (sau khi pull code)
git pull origin main
npm run migration:run  # Apply migration của Developer A
```

## 🎯 Common Use Cases

### Add Column
```typescript
@Column({ nullable: true })
newField: string;
```
```bash
npm run migration:generate AddNewField
```

### Remove Column
```typescript
// Xóa field trong entity
```
```bash
npm run migration:generate RemoveOldField
```

### Rename Column
```typescript
@Column({ name: 'new_name' })
newName: string; // rename từ old_name
```
```bash
npm run migration:generate RenameColumn
```

### Add Index
```typescript
@Index()
@Column()
email: string;
```
```bash
npm run migration:generate AddEmailIndex
```

### Add Foreign Key
```typescript
@ManyToOne(() => User)
user: User;
```
```bash
npm run migration:generate AddUserRelation
```

---

**🎉 Done! Bây giờ bạn đã sẵn sàng làm việc với migrations.**

**📚 Đọc thêm:**
- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [Database README](./src/database/README.md)
