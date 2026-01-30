const db = require("./Backend/src/config/db");

async function checkSchema() {
    try {
        const res = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'admin_audit_logs'
      ORDER BY ordinal_position
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        process.exit();
    }
}

checkSchema();
