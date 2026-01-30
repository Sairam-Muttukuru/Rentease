
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function checkMembers() {
    try {
        const res = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tenant_members'
    `);

        res.rows.forEach(r => {
            console.log(`${r.column_name}: ${r.data_type} (Nullable: ${r.is_nullable})`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkMembers();
