import dataSource from '../../config/database.config';
import { seedAdmin } from './admin.seed';
import { seedTestUsers } from './test-users.seed';

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Initialize database connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Database connection established\n');

    // Run seeds
    await seedAdmin(dataSource);
    await seedTestUsers(dataSource);

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run seeds
runSeeds();
