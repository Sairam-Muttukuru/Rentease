const db = require('../config/db');

async function createNotificationTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL, -- 'complaint', 'payment', etc.
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("✅ Notifications table created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating notifications table:", error);
        process.exit(1);
    }
}

createNotificationTable();
