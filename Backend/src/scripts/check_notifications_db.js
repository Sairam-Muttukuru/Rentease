const db = require('../config/db');

async function checkNotifications() {
    try {
        console.log("🔍 Checking recent notifications...");
        const res = await db.query(`
            SELECT n.id, n.user_id, n.title, n.created_at, u.email as landlord_email 
            FROM notifications n
            JOIN users u ON u.id = n.user_id
            ORDER BY n.created_at DESC 
            LIMIT 5
        `);

        console.table(res.rows);

        if (res.rows.length === 0) {
            console.log("⚠️ No notifications found in the table.");
        } else {
            console.log(`✅ Found ${res.rows.length} recent notifications.`);
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Error querying notifications:", error);
        process.exit(1);
    }
}

checkNotifications();
