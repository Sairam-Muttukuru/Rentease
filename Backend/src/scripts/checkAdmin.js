const db = require("../config/db");

async function checkAdmin() {
    console.log("🔍 Finding Admin User...");
    try {
        const res = await db.query("SELECT email, role FROM users WHERE role = 'ADMIN'");
        if (res.rows.length > 0) {
            console.log("✅ Admin found:", res.rows[0]);
        } else {
            console.log("❌ No Admin user found!");
        }
    } catch (err) {
        console.error("❌ Error querying DB:", err);
    } finally {
        process.exit();
    }
}

checkAdmin();
