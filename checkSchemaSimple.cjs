const db = require("./Backend/src/config/db");

async function check() {
    try {
        const res = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admin_audit_logs'
    `);
        console.log("COLUMNS FOUND:");
        res.rows.forEach(r => console.log(`- ${r.column_name}`));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
