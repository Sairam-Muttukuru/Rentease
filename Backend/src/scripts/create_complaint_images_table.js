const db = require('../config/db');

async function createComplaintImagesTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS complaint_images (
                id SERIAL PRIMARY KEY,
                complaint_id INT REFERENCES complaints(id) ON DELETE CASCADE,
                image_url TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("✅ complaint_images table created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating complaint_images table:", error);
        process.exit(1);
    }
}

createComplaintImagesTable();
