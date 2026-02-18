const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Try a few possible paths for .env
const envPaths = [
    path.join(__dirname, 'src', '.env'),
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env')
];

let envPath = envPaths.find(p => fs.existsSync(p));

require('dotenv').config({ path: envPath });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function migrate() {
    try {
        console.log("Starting migration to increase character limits...");

        await pool.query(`
            ALTER TABLE properties 
            ALTER COLUMN room_type TYPE VARCHAR(50),
            ALTER COLUMN gender_allowed TYPE VARCHAR(30),
            ALTER COLUMN rent_cycle TYPE VARCHAR(30)
        `);

        console.log("Migration successful: Character limits increased.");
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await pool.end();
    }
}

migrate();
