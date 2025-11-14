import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from 'src/common/enums';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  console.log('🔍 Checking for existing admin user...');

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin123@vinhxuan.com' },
  });

  if (existingAdmin) {
    console.log('⏭️  Admin user already exists. Skipping...');
    return;
  }

  console.log('🔐 Creating default admin user...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = userRepository.create({
    fullName: 'Administrator123',
    email: 'admin123@vinhxuan.com',
    password: hashedPassword,
    phone: '0123456789',
    dateOfBirth: new Date('1990-01-01'),
    role: UserRole.ADMIN,
    status: true,
  });

  await userRepository.save(admin);

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email: admin123@vinhxuan.com');
  console.log('🔑 Password: admin123');
  console.log('⚠️  Please change the password after first login!');
}
