const db = require("../src/config/db");

async function migrate() {
    try {
        console.log("Starting migration: Adding team_details and worker_names/phones to service_requests...");
        
        // Using JSONB for maximum flexibility in worker details
        await db.query(`
            ALTER TABLE service_requests 
            ADD COLUMN IF NOT EXISTS worker_details JSONB DEFAULT '[]';
        `);
        
        console.log("Migration successful: worker_details column added.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
