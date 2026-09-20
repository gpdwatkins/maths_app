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

    // Add columns if they don't exist
    console.log('Adding first_name and surname columns...');
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS first_name TEXT,
      ADD COLUMN IF NOT EXISTS surname TEXT;
    `);
    console.log('Columns added');

    // Update George's record
    console.log('Updating George...');
    await client.query(`
      UPDATE users
      SET first_name = 'George', surname = 'Watkins', username = 'George Watkins'
      WHERE username = 'George';
    `);

    // Update all other users (firstname_surname format)
    console.log('Updating other users...');
    await client.query(`
      UPDATE users
      SET
        first_name = INITCAP(SPLIT_PART(username, '_', 1)),
        surname = INITCAP(SPLIT_PART(username, '_', 2)),
        username = INITCAP(SPLIT_PART(username, '_', 1)) || ' ' || INITCAP(SPLIT_PART(username, '_', 2))
      WHERE username LIKE '%_%' AND username != 'George Watkins';
    `);

    // Verify results
    const result = await client.query('SELECT id, username, first_name, surname FROM users ORDER BY username');
    console.log('\nUpdated users:');
    console.table(result.rows);

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
