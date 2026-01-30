const db = require("./Backend/src/config/db");
const model = require("./Backend/src/models/admin.model");

async function testLog() {
    try {
        // 0. List all tables
        console.log("🔍 Checking visible tables...");
        const tables = await db.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.table(tables.rows);

        // 1. Get an admin user
        const userRes = await db.query("SELECT id, first_name FROM users WHERE role='ADMIN' LIMIT 1");
        if (userRes.rows.length === 0) {
            console.log("No admin user found to test with.");
            process.exit(0);
        }
        const admin = userRes.rows[0];
        console.log(`Testing with Admin: ${admin.first_name} (ID: ${admin.id})`);

        // 2. Call logAction
        await model.logAction(admin.id, "TEST_ACTION_MANUAL_VERIFICATION");
        console.log("✅ logAction called.");

        // 3. Verify insertion
        const logRes = await db.query("SELECT * FROM admin_audit_logs WHERE action='TEST_ACTION_MANUAL_VERIFICATION'");
        if (logRes.rows.length > 0) {
            console.log("✅ Log verified as inserted:");
            console.table(logRes.rows);

            // Cleanup
            await db.query("DELETE FROM admin_audit_logs WHERE action='TEST_ACTION_MANUAL_VERIFICATION'");
            console.log("🧹 Test log cleaned up.");
        } else {
            console.error("❌ Log NOT found in database.");
        }

    } catch (err) {
        console.error("❌ Test failed:", err.message);
    } finally {
        process.exit();
    }
}

testLog();
