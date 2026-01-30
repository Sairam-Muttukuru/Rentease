
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function debugDates() {
    try {
        const res = await db.query(`SELECT id, rent_due_date FROM tenants`);
        const today = new Date();

        console.log("System Time:", today.toString());
        console.log("System ISO:", today.toISOString());

        for (const t of res.rows) {
            console.log(`\nTenant ID: ${t.id}`);
            console.log(`DB Raw rent_due_date:`, t.rent_due_date, typeof t.rent_due_date);

            const d = new Date(t.rent_due_date);
            console.log(`Parsed Date: ${d.toString()}`);
            console.log(`Parsed ISO: ${d.toISOString()}`);

            // Simulation of Month set
            let target = new Date(d);
            target.setFullYear(2026);
            target.setMonth(0); // Jan
            console.log(`Set to Jan 2026: ${target.toString()}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

debugDates();
