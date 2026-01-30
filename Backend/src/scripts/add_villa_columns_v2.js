
const pool = require("../config/db");

const runMigration = async () => {
    const client = await pool.connect();
    try {
        console.log("Starting migration: Adding Villa columns...");

        // Add duplex_type
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS duplex_type BOOLEAN DEFAULT FALSE;
    `);
        console.log("Added duplex_type");

        // Add private_parking_slots
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS private_parking_slots INTEGER DEFAULT 0;
    `);
        console.log("Added private_parking_slots");

        // Add private_garden
        await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS private_garden BOOLEAN DEFAULT FALSE;
    `);
        console.log("Added private_garden");

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        client.release();
        pool.end();
    }
};

runMigration();
