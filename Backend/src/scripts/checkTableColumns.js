const db = require("../config/db");

async function checkColumns() {
    console.log("🔍 Checking service_requests columns...");
    try {
        const res = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'service_requests'
        `);
        console.log("Columns:", res.rows.map(r => r.column_name));
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit();
    }
}

checkColumns();
