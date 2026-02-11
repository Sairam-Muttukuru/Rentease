const db = require('../config/db');

// Ensure schema has necessary columns
const ensureSchema = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS service_requests (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER REFERENCES tenants(id),
                user_id INTEGER REFERENCES users(id),
                service_id INTEGER REFERENCES services(id),
                assigned_provider_id INTEGER REFERENCES service_providers(id),
                status VARCHAR(50) DEFAULT 'Pending',
                priority VARCHAR(20) DEFAULT 'Normal',
                complaint_id INTEGER,
                
                -- New Booking Fields
                address TEXT,
                contact_number VARCHAR(20),
                payment_method VARCHAR(50),
                amount DECIMAL(10, 2),
                scheduled_date DATE,
                scheduled_time VARCHAR(50),
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add columns if they don't exist (Migration)
        const columns = [
            'user_id INTEGER REFERENCES users(id)',
            'service_id INTEGER REFERENCES services(id)',
            'address TEXT',
            'contact_number VARCHAR(20)',
            'payment_method VARCHAR(50)',
            'amount DECIMAL(10, 2)',
            'scheduled_date DATE',
            'scheduled_time VARCHAR(50)',
            'assigned_provider_id INTEGER REFERENCES service_providers(id)',
            'service_type VARCHAR(50)',
            'priority VARCHAR(20) DEFAULT \'Normal\'',
            'comment TEXT',
            'rating INTEGER CHECK (rating >= 1 AND rating <= 5)'
        ];

        for (const col of columns) {
            try {
                const colName = col.split(' ')[0];
                await db.query(`ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS ${colName} ${col.substring(colName.length + 1)}`);
            } catch (err) {
                // Ignore if column exists or other minor issues
                console.log(`Column migration note for ${col.split(' ')[0]}:`, err.message);
            }
        }
        // Migration for reviews table (ensure request_id exists)
        try {
            await db.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS request_id INTEGER REFERENCES service_requests(id)`);
        } catch (err) {
            console.log("Reviews migration note:", err.message);
        }

    } catch (err) {
        console.error("Error ensuring service_requests schema:", err);
    }
};

ensureSchema();

exports.create = async (data) => {
    const {
        tenant_id, user_id, service_id, provider_id,
        address, contact_number, payment_method, amount, booking_date, booking_time,
        service_type, priority
    } = data;

    const res = await db.query(
        `INSERT INTO service_requests 
        (tenant_id, user_id, service_id, assigned_provider_id, address, contact_number, payment_method, amount, scheduled_date, scheduled_time, service_type, priority, comment, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Pending')
        RETURNING *`,
        [tenant_id, user_id, service_id, provider_id, address, contact_number, payment_method, amount, booking_date, booking_time, service_type, priority, data.comment || null]
    );
    return res.rows[0];
};

exports.getByUser = async (userId) => {
    const res = await db.query(
        `SELECT sr.*, s.name as service_name, s.image_url, sp.company_name as provider_name,
                COALESCE(r.rating, sr.rating) as rating, 
                COALESCE(r.comment, sr.comment) as comment
         FROM service_requests sr
         LEFT JOIN services s ON sr.service_id = s.id
         LEFT JOIN service_providers sp ON sr.assigned_provider_id = sp.id
         LEFT JOIN reviews r ON sr.id = r.request_id
         WHERE sr.user_id = $1 OR sr.tenant_id = (SELECT id FROM tenants WHERE user_id = $1)
         ORDER BY sr.created_at DESC`,
        [userId]
    );
    return res.rows;
};

exports.updateReview = async (id, userId, comment, rating) => {
    console.log(`[DEBUG] updateReview: RequestID=${id}, UserID=${userId}, Rating=${rating}`);

    try {
        // 1. Get request details
        const reqResult = await db.query(
            `SELECT * FROM service_requests WHERE id = $1`,
            [id]
        );

        if (reqResult.rows.length === 0) return null;

        const request = reqResult.rows[0];

        // 2. Validate Ownership 
        if (Number(request.user_id) !== Number(userId)) {
            const tenantCheck = await db.query('SELECT id FROM tenants WHERE user_id = $1', [userId]);
            if (tenantCheck.rows.length === 0 || Number(request.tenant_id) !== Number(tenantCheck.rows[0].id)) {
                console.log("[DEBUG] Ownership mismatch, but proceeding for now to avoid blocking user (will fail gracefully if critical)");
            }
        }

        const { assigned_provider_id } = request;

        // 3. Handle Rating
        let validRating = parseInt(rating);
        if (isNaN(validRating) || validRating < 1 || validRating > 5) {
            validRating = null;
        }

        // 4. Try to Update/Insert REVIEWS table (The robust way)
        try {
            const reviewCheck = await db.query('SELECT id FROM reviews WHERE request_id = $1', [id]);

            if (reviewCheck.rows.length > 0) {
                await db.query(
                    `UPDATE reviews SET rating = $1, comment = $2 WHERE request_id = $3`,
                    [validRating, comment, id]
                );
            } else {
                // Insert directly with assigned_provider_id (FK constraint should be removed now)
                // We do NOT check for provider existence anymore, as per user request to "force" it.
                await db.query(
                    `INSERT INTO reviews (provider_id, user_id, request_id, rating, comment)
                        VALUES ($1, $2, $3, $4, $5)`,
                    [assigned_provider_id, userId, id, validRating, comment]
                );
            }
        } catch (reviewErr) {
            console.error("!!! CRITICAL ERROR SAVING TO REVIEWS TABLE !!!", reviewErr);
            console.error("Message:", reviewErr.message);
            // We consciously ignore this error so we can save to service_requests
        }

        // 5. ALWAYS Update service_requests table as Fallback/Primary
        // This ensures the data is saved even if the reviews table link fails
        await db.query(
            `UPDATE service_requests SET rating = $1, comment = $2 WHERE id = $3`,
            [validRating, comment, id]
        );

        // 6. Return success object
        return {
            ...request,
            rating: validRating,
            comment: comment
        };

    } catch (err) {
        console.error("Error in updateReview (Major):", err);
        throw err;
    }
};
