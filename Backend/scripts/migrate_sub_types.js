const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Adjust path to .env if needed

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting migration...');
        await client.query('BEGIN');

        // 1. Create service_sub_types table
        console.log('Creating service_sub_types table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS service_sub_types (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        image_url TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Add sub_type_id to services table
        console.log('Adding sub_type_id to services table...');
        await client.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS sub_type_id UUID REFERENCES service_sub_types(id) ON DELETE SET NULL;
    `);

        // 3. Make type_id nullable in services table (optional, but good for flexibility)
        console.log('Making type_id nullable in services table...');
        await client.query(`
      ALTER TABLE services 
      ALTER COLUMN type_id DROP NOT NULL;
    `);

        await client.query('COMMIT');
        console.log('Migration completed successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
