const db = require("./Backend/src/config/db");

async function check() {
    try {
        const res = await db.query("SELECT * FROM admin_audit_logs");
        console.log("Rows:", res.rows);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        process.exit();
    }
}

check();
