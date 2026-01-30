
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function checkUser() {
    try {
        const email = 'bhavanimuttukuru@gmail.com';
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            console.log(`❌ User with email ${email} NOT FOUND in database.`);
        } else {
            console.log(`✅ User found:`, result.rows[0]);
        }
    } catch (err) {
        console.error("Error checking user:", err);
    } finally {
        process.exit();
    }
}

checkUser();
