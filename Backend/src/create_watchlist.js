const pool = require('./config/db');

const createWatchlistTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS watchlist (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, property_id)
        );
    `;
    try {
        await pool.query(query);
        console.log("Watchlist table created successfully.");
    } catch (err) {
        console.error("Error creating watchlist table:", err);
    } finally {
        pool.end();
    }
};

createWatchlistTable();
