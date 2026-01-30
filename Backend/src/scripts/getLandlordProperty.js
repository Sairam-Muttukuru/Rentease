
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function getProp() {
    try {
        const res = await db.query("SELECT id, title, status FROM properties WHERE landlord_id = 24 AND status = 'Available' LIMIT 1");
        if (res.rows.length > 0) {
            console.log(`Property Found: ID=${res.rows[0].id}, Title=${res.rows[0].title}`);
        } else {
            console.log("No Available Property found for Landlord 24.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

getProp();
