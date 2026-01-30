
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function checkTypes() {
    try {
        const res = await db.query(`
      SELECT table_name, column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'tenants' AND column_name LIKE '%date'
      ORDER BY table_name;
    `);

        res.rows.forEach(r => {
            console.log(`${r.table_name}.${r.column_name}: ${r.data_type} (${r.udt_name})`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkTypes();
