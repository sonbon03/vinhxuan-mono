import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '@shared';

export async function seedTestUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  console.log('🔍 Checking for existing test users...');

  // Test users to create
  const testUsers = [
    {
      email: 'staff@vinhxuan.com',
      fullName: 'Nhân Viên Test',
      password: 'staff123',
      role: UserRole.STAFF,
      phone: '0123456788',
      dateOfBirth: new Date('1995-06-15'),
    },
    {
      email: 'customer@vinhxuan.com',
      fullName: 'Khách Hàng Test',
      password: 'customer123',
      role: UserRole.CUSTOMER,
      phone: '0123456787',
      dateOfBirth: new Date('1998-03-20'),
    },
  ];

  for (const userData of testUsers) {
    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`⏭️  User ${userData.email} already exists. Skipping...`);
      continue;
    }

    console.log(`🔐 Creating test user: ${userData.email}...`);

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = userRepository.create({
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      role: userData.role,
      status: true,
    });

    await userRepository.save(user);

    console.log(`✅ User created: ${userData.email}`);
    console.log(`🔑 Password: ${userData.password}`);
  }

  console.log('✅ Test users seeding completed!');
  console.log('\n📝 Test Accounts:');
  console.log('   Admin:    admin@vinhxuan.com / admin123');
  console.log('   Staff:    staff@vinhxuan.com / staff123');
  console.log('   Customer: customer@vinhxuan.com / customer123');
}
