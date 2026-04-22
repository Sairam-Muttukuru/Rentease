const pool = require('../../config/db');

const WatchlistController = {
    toggleWatchlist: async (req, res) => {
        const { propertyId } = req.body;
        const userId = req.user.id; // From auth middleware

        try {
            // Check if already in watchlist
            const checkQuery = 'SELECT * FROM watchlist WHERE user_id = $1 AND property_id = $2';
            const { rows } = await pool.query(checkQuery, [userId, propertyId]);

            if (rows.length > 0) {
                // Remove from watchlist
                await pool.query('DELETE FROM watchlist WHERE user_id = $1 AND property_id = $2', [userId, propertyId]);
                return res.status(200).json({ message: "Removed from watchlist", added: false });
            } else {
                // Add to watchlist
                await pool.query('INSERT INTO watchlist (user_id, property_id) VALUES ($1, $2)', [userId, propertyId]);
                return res.status(201).json({ message: "Added to watchlist", added: true });
            }
        } catch (error) {
            console.error("Error toggling watchlist:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getWatchlist: async (req, res) => {
        const userId = req.user.id;

        try {
            const query = `
                SELECT w.id as watchlist_id, p.*, 
                (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = true LIMIT 1) as cover_image,
                l.first_name as landlord_first_name, l.last_name as landlord_last_name
                FROM watchlist w
                JOIN properties p ON w.property_id = p.id
                JOIN users l ON p.landlord_id = l.id
                WHERE w.user_id = $1
                ORDER BY w.created_at DESC
            `;
            const { rows } = await pool.query(query, [userId]);
            res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching watchlist:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    checkStatus: async (req, res) => {
        const { propertyId } = req.params;
        const userId = req.user.id;

        try {
            const query = 'SELECT 1 FROM watchlist WHERE user_id = $1 AND property_id = $2';
            const { rows } = await pool.query(query, [userId, propertyId]);
            res.status(200).json({ inWatchlist: rows.length > 0 });
        } catch (error) {
            console.error("Error checking watchlist status:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = WatchlistController;
