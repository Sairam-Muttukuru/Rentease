const db = require("./config/db");
async function check() {
    try {
        const res = await db.query("SELECT COUNT(*) FROM service_requests");
        console.log("Service Request Count:", res.rows[0].count);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
