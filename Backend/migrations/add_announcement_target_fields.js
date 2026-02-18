const db = require('../src/config/db');

async function runMigration() {
    try {
        console.log("Starting migration...");

        await db.query(`
            ALTER TABLE announcements 
            ADD COLUMN IF NOT EXISTS property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
            ADD COLUMN IF NOT EXISTS target_type VARCHAR(50) DEFAULT 'all',
            ADD COLUMN IF NOT EXISTS target_tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;
        `);

        console.log("Migration successful: Added columns to announcements table.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

runMigration();
