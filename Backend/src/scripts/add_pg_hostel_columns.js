const pool = require('../config/db');

const addPgHostelColumns = async () => {
    const client = await pool.connect();
    try {
        console.log('Adding PG/Hostel columns to properties table...');

        await client.query('BEGIN');

        // Add room_type column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS room_type VARCHAR(50);
    `);
        console.log('Added room_type column');

        // Add food_included column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS food_included BOOLEAN DEFAULT FALSE;
    `);
        console.log('Added food_included column');

        // Add electricity_included column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS electricity_included BOOLEAN DEFAULT FALSE;
    `);
        console.log('Added electricity_included column');

        // Add gender_allowed column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS gender_allowed VARCHAR(50);
    `);
        console.log('Added gender_allowed column');

        await client.query('COMMIT');
        console.log('Successfully added all PG/Hostel columns');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding columns:', err);
    } finally {
        client.release();
        process.exit();
    }
};

addPgHostelColumns();
