
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function checkInconsistency() {
    try {
        const res = await db.query(`
      SELECT p.id, p.title, p.status, t.id as tenant_id
      FROM properties p
      JOIN tenants t ON p.id = t.property_id
      WHERE p.status = 'Available'
    `);

        if (res.rows.length > 0) {
            console.log("❌ INCONSISTENCY FOUND: The following 'Available' properties already have tenants:");
            console.table(res.rows);
        } else {
            console.log("✅ No inconsistencies found. All 'Available' properties are truly tenant-free.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkInconsistency();
