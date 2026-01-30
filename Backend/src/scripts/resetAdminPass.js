const db = require("../config/db");
const bcrypt = require("bcryptjs");

async function resetAdminPass() {
    console.log("🔄 Resetting Admin Password...");
    try {
        const hash = await bcrypt.hash("admin123", 10);
        await db.query("UPDATE users SET password = $1 WHERE role = 'ADMIN'", [hash]);
        console.log("✅ Admin password set to: admin123");
    } catch (err) {
        console.error("❌ Error resetting password:", err);
    } finally {
        process.exit();
    }
}

resetAdminPass();
