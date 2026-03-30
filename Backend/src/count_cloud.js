const { Pool } = require("pg");
require("dotenv").config();
async function check() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        const res = await pool.query("SELECT COUNT(*) FROM service_requests");
        console.log("Cloud SR Count:", res.rows[0].count);
        process.exit(0);
    } catch (err) {
        console.error("Cloud Connection Failed:", err.message);
        process.exit(1);
    }
}
check();
