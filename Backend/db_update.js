const db = require("./src/config/db");

const updateDB = async () => {
    try {
        console.log("Checking database schema...");

        // 1. Add category column to complaints table if it doesn't exist
        await db.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    `);
        console.log("Confirmed 'category' column in 'complaints' table.");

        // 2. Create complaint_images table if it doesn't exist
        await db.query(`
      CREATE TABLE IF NOT EXISTS complaint_images (
        id SERIAL PRIMARY KEY,
        complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Confirmed 'complaint_images' table.");

        console.log("Database schema update complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error updating database:", err);
        process.exit(1);
    }
};

updateDB();
