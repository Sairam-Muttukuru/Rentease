
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function getLandlord() {
    try {
        const res = await db.query("SELECT id, email, role FROM users WHERE role = 'LANDLORD' LIMIT 1");
        if (res.rows.length > 0) {
            console.log(`Landlord Found: ID=${res.rows[0].id}, Email=${res.rows[0].email}`);
        } else {
            console.log("No Landlord found.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

getLandlord();
