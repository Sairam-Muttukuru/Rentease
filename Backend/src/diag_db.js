const db = require("./config/db");
async function check() {
    try {
        const res = await db.query("SELECT current_database()");
        console.log("Current DB:", res.rows[0].current_database);
        const res2 = await db.query("SELECT id FROM service_requests LIMIT 5");
        console.log("Service Request IDs:", res2.rows.map(r => r.id));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
