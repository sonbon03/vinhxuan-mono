import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../config/database.config';

async function runMigrations() {
  try {
    console.log('Initializing database connection...');

    // Create a new DataSource with synchronize disabled
    const migrationDataSource = new DataSource({
      ...dataSourceOptions,
      synchronize: false, // Disable synchronize when running migrations
    });

    await migrationDataSource.initialize();

    console.log('Running pending migrations...');
    const migrations = await migrationDataSource.runMigrations({ transaction: 'all' });

    if (migrations.length === 0) {
      console.log('No pending migrations found.');
    } else {
      console.log(`Successfully executed ${migrations.length} migrations:`);
      migrations.forEach(migration => {
        console.log(`  - ${migration.name}`);
      });
    }

    await migrationDataSource.destroy();
    console.log('Migration process completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigrations();
