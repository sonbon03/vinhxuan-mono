import dataSource from '../../config/database.config';
import * as fs from 'fs';
import * as path from 'path';

async function generateMigration() {
  try {
    // Get migration name from command line args
    const migrationName = process.argv[2] || 'InitialSchema';

    console.log(`Initializing database connection...`);
    await dataSource.initialize();

    console.log(`Generating migration: ${migrationName}`);

    // Generate migration using TypeORM's built-in SQL comparison
    const sqlInMemory = await dataSource.driver.createSchemaBuilder().log();

    if (sqlInMemory.upQueries.length === 0) {
      console.log('No changes in database schema were found - cannot generate a migration.');
      await dataSource.destroy();
      process.exit(0);
    }

    // Create migration file
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${migrationName}.ts`;
    const directory = __dirname + '/../migrations';
    const path = `${directory}/${filename}`;

    const upQueries = sqlInMemory.upQueries.map(query =>
      `        await queryRunner.query(\`${query.query.replace(/`/g, '\\`')}\`);`
    ).join('\n');

    const downQueries = sqlInMemory.downQueries.map(query =>
      `        await queryRunner.query(\`${query.query.replace(/`/g, '\\`')}\`);`
    ).join('\n');

    const fileContent = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${migrationName}${timestamp} implements MigrationInterface {
    name = '${migrationName}${timestamp}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upQueries}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downQueries}
    }
}
`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(path, fileContent);

    console.log(`Migration ${filename} has been generated successfully.`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error during migration generation:', error);
    process.exit(1);
  }
}

generateMigration();
