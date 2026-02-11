const db = require("../config/db");

const ensureSchema = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES service_providers(id),
                user_id INTEGER REFERENCES users(id),
                request_id INTEGER REFERENCES service_requests(id),
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration to add request_id if it doesn't exist in the existing 'reviews' table
        try {
            await db.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS request_id INTEGER REFERENCES service_requests(id)`);
        } catch (err) {
            console.log("Column migration note:", err.message);
        }
    } catch (err) {
        console.error("Error ensuring reviews schema:", err);
    }
};

ensureSchema();

exports.addReview = async (data) => {
    const { provider_id, user_id, request_id, rating, comment } = data;
    const res = await db.query(
        `INSERT INTO reviews (provider_id, user_id, request_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [provider_id, user_id, request_id, rating, comment]
    );
    return res.rows[0];
};

exports.getReviewsByProvider = async (providerId) => {
    const res = await db.query(
        `SELECT r.*, u.first_name, u.last_name, u.avatar_url,
     u.first_name || ' ' || u.last_name as user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.provider_id = $1
     ORDER BY r.created_at DESC`,
        [providerId]
    );
    return res.rows;
};
