const db = require('../config/db');

async function addPriorityLevelColumn() {
    try {
        await db.query(`
            ALTER TABLE complaints 
            ADD COLUMN IF NOT EXISTS priority_level VARCHAR(50) DEFAULT 'Low';
        `);
        console.log("✅ priority_level column added to complaints table.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding priority_level column:", error);
        process.exit(1);
    }
}

addPriorityLevelColumn();
