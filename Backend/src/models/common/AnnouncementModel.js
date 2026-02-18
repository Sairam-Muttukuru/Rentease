const db = require("../../config/db");

exports.create = async (data) => {
    return (await db.query(
        `
        INSERT INTO announcements
        (landlord_id, property_id, title, category, priority, content, audience, target_type, target_tenant_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            data.landlord_id,
            data.property_id,
            data.title,
            data.category,
            data.priority,
            data.content,
            data.audience || 'all',
            data.target_type || 'all',
            data.target_tenant_id || null
        ]
    )).rows[0];
};

exports.getAllByLandlord = async (landlordId) => {
    return (await db.query(
        `
        SELECT * FROM announcements
        WHERE landlord_id = $1
        ORDER BY created_at DESC
        `,
        [landlordId]
    )).rows;
};

exports.delete = async (id) => {
    return (await db.query(
        `
        DELETE FROM announcements
        WHERE id = $1
        RETURNING *
        `,
        [id]
    )).rows[0];
};

exports.getAllForTenant = async (propertyId, tenantId) => {
    return (await db.query(
        `
        SELECT a.*, u.first_name || ' ' || u.last_name as author_name
        FROM announcements a
        JOIN users u ON a.landlord_id = u.id
        WHERE a.property_id = $1 
        AND (a.target_type = 'all' OR a.target_tenant_id = $2)
        ORDER BY a.created_at DESC
        `,
        [propertyId, tenantId]
    )).rows;
};
