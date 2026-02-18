const pool = require('./src/config/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    landlord_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Maintenance', 'Event', 'General')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    content TEXT NOT NULL,
    audience VARCHAR(50) DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const run = async () => {
    try {
        await pool.query(createTableQuery);
        console.log("Table 'announcements' created successfully.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        pool.end();
    }
};

run();
