
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function fixSchema() {
    try {
        console.log("🛠 Fixing tenants table schema...");
        await db.query("ALTER TABLE tenants ALTER COLUMN rent_due_date TYPE DATE USING NULL");
        console.log("✅ Successfully changed rent_due_date to DATE.");
    } catch (err) {
        console.error("❌ Schema fix failed:", err);
    } finally {
        process.exit();
    }
}

fixSchema();
