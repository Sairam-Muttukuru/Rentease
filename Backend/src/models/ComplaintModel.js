const db = require("../config/db");

exports.create = async (data) => {
    return (await db.query(
        `
    INSERT INTO complaints
    (tenant_id, landlord_id, property_id, title, description, category, priority_level)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
        [
            data.tenant_id,
            data.landlord_id,
            data.property_id,
            data.title,
            data.description,
            data.category,
            data.priority_level
        ]
    )).rows[0];
};

exports.getByTenantId = async (tenantId) => {
    return (
        await db.query(
            `
        SELECT 
        c.*,
        p.title AS property_name,
        COALESCE(
          (
            SELECT json_agg(ci.image_url)
            FROM complaint_images ci
            WHERE ci.complaint_id = c.id
          ), '[]'
        ) AS images,
        to_char(c.created_at, 'Mon DD, YYYY') as date
      FROM complaints c
      JOIN properties p ON p.id = c.property_id
      WHERE c.tenant_id = $1
      ORDER BY c.created_at DESC
      `,
            [tenantId]
        )
    ).rows;
};

exports.getByLandlordId = async (landlordId) => {
    return (
        await db.query(
            `
      SELECT 
        c.*,
        p.title AS property_name,
        p.flat_number,
        p.building_name,
        p.property_type,
        p.address,
        p.city,
        p.locality,
        tm.full_name AS tenant_name,
        to_char(c.created_at, 'Mon DD, YYYY') as formatted_date,
        COALESCE(
          (
            SELECT json_agg(ci.image_url)
            FROM complaint_images ci
            WHERE ci.complaint_id = c.id
          ), '[]'::json
        ) AS images,
        (
            SELECT image_url 
            FROM property_images pi 
            WHERE pi.property_id = p.id AND pi.is_cover = true 
            LIMIT 1
        ) as property_cover_image
      FROM complaints c
      JOIN properties p ON p.id = c.property_id
      JOIN tenant_members tm 
        ON tm.tenant_id = c.tenant_id AND tm.is_primary = true
      WHERE c.landlord_id = $1
      ORDER BY c.created_at DESC
      `,
            [landlordId]
        )
    ).rows;
};


exports.updateStatus = async (id, status) => {
    return (await db.query(
        `
    UPDATE complaints
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
        [status, id]
    )).rows[0];
};
