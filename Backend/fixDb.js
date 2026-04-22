const pool = require('./src/config/db');

async function run() {
    try {
        const res = await pool.query(`
            UPDATE service_requests 
            SET service_type = 'AC Installation' 
            WHERE service_type IN ('Standard', 'Home Service', 'General') OR service_type IS NULL OR service_type = '';
        `);
        console.log("Updated rows:", res.rowCount);
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
