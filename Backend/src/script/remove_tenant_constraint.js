const db = require("../config/db");

async function run() {
    try {
        console.log("Removing unique constraint on tenants(property_id)...");
        await db.query(`ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_property_id_key CASCADE;`);
        console.log("SUCCESS: Unique constraint removed.");
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Error removing constraint:", error);
        process.exit(1);
    }
}

run();
