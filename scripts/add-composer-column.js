const { Client } = require('pg');

// Use pooler endpoint for better connectivity
const client = new Client({
  host: 'aws-0-eu-west-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.vkavxaldrtrhcptkgkxc',
  password: 'zFSmUnrKwCNZ3KBt',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Add is_composer column if it doesn't exist
    console.log('Adding is_composer column...');
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_composer BOOLEAN DEFAULT FALSE;
    `);
    console.log('Column added');

    // Verify the column exists
    const result = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'is_composer';
    `);
    console.log('\nColumn info:');
    console.table(result.rows);

    // Show current users and their composer status
    const users = await client.query('SELECT id, username, is_composer FROM users ORDER BY username');
    console.log('\nUsers with is_composer status:');
    console.table(users.rows);

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
