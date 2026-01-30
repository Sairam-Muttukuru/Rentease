const pool = require('../config/db');

const addCommercialShopColumns = async () => {
    const client = await pool.connect();
    try {
        console.log('Adding Commercial Shop columns to properties table...');

        await client.query('BEGIN');

        // Add shop_use_type column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS shop_use_type VARCHAR(50);
    `);
        console.log('Added shop_use_type column');

        // Add water_available column
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS water_available BOOLEAN DEFAULT FALSE;
    `);
        console.log('Added water_available column');

        await client.query('COMMIT');
        console.log('Successfully added all Commercial Shop columns');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding columns:', err);
    } finally {
        client.release();
        process.exit();
    }
};
addCommercialShopColumns();
