const db = require("../../config/db");

exports.getProviderId = async (userId) => {
    const res = await db.query("SELECT id FROM service_providers WHERE user_id = $1", [userId]);
    return res.rows[0]?.id;
};

exports.getProfile = async (userId) => {
    const res = await db.query("SELECT * FROM service_providers WHERE user_id = $1", [userId]);
    return res.rows[0];
};

exports.updateProfile = async (userId, data) => {
    const { company_name, service_area, phone, experience, about_us, service_type, status, avatar_url } = data;
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const expInt = experience ? parseInt(experience) : null;

        // 1. Update service_providers table
        const providerRes = await client.query(
            `UPDATE service_providers 
             SET company_name = COALESCE($1, company_name),
                 service_area = COALESCE($2, service_area),
                 phone = COALESCE($3, phone),
                 phone_number = COALESCE($3, phone_number),
                 experience = COALESCE($4, experience),
                 about_us = COALESCE($5, about_us),
                 service_type = COALESCE($6, service_type),
                 status = COALESCE($7, status),
                 avatar_url = COALESCE($8, avatar_url)
             WHERE user_id = $9 RETURNING *`,
            [
                company_name || null,
                service_area || null,
                phone || null,
                expInt,
                about_us || null,
                service_type || null,
                status || null,
                avatar_url || null,
                userId
            ]
        );

        // 2. Explicitly update the users table for phone and avatar synchronization
        const userUpdates = [];
        const userValues = [];

        if (company_name) {
            userUpdates.push(`first_name = $${userUpdates.length + 1}`);
            userValues.push(company_name);
            userUpdates.push(`last_name = $${userUpdates.length + 1}`);
            userValues.push('(Provider)');
        }
        if (phone) {
            userUpdates.push(`phone = $${userUpdates.length + 1}`);
            userValues.push(phone);
        }
        if (avatar_url) {
            userUpdates.push(`avatar_url = $${userUpdates.length + 1}`);
            userValues.push(avatar_url);
        }

        if (userUpdates.length > 0) {
            userValues.push(userId);
            const userQuery = `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userValues.length}`;
            console.log("CRITICAL SYNC: Updating users table:", userQuery, userValues);
            await client.query(userQuery, userValues);
        }

        await client.query('COMMIT');
        console.log("SUCCESS: Profile sync complete for user", userId);
        return providerRes.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("CRITICAL ERROR: Profile Update/Sync Failure:", e);
        throw e;
    } finally {
        client.release();
    }
};

exports.getServices = async (providerId) => {
    const res = await db.query(
        `SELECT DISTINCT ON (s.name) ps.*, s.name, s.description, s.image_url, s.features, 
                st.name as type_name, sc.name as category_name
         FROM provider_services ps
         JOIN services s ON ps.service_id = s.id
         JOIN service_types st ON s.type_id = st.id
         JOIN service_categories sc ON st.category_id = sc.id
         WHERE ps.provider_id = $1 
         ORDER BY s.name, ps.created_at DESC`,
        [providerId]
    );
    return res.rows;
};

exports.addService = async (providerId, data) => {
    const { service_id, price } = data;

    // Check if already exists
    const existing = await db.query(
        "SELECT * FROM provider_services WHERE provider_id = $1 AND service_id = $2",
        [providerId, service_id]
    );

    if (existing.rows.length > 0) {
        // Update price and reactivate if exists
        return exports.updateService(existing.rows[0].id, providerId, { price, is_active: true });
    }

    const res = await db.query(
        `INSERT INTO provider_services (provider_id, service_id, price)
         VALUES ($1, $2, $3) RETURNING *`,
        [providerId, service_id, price]
    );
    return res.rows[0];
};

exports.createAndAddService = async (providerId, data) => {
    const { name, description, category_id, type_id, other_category, other_type, price, image_url, features } = data;

    // Start transaction
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        let finalCategoryId = category_id;
        let finalTypeId = type_id;

        // 1. If 'others' category is selected, create it
        if (category_id === 'others' && other_category) {
            const catRes = await client.query(
                "INSERT INTO service_categories (name, color, icon_name) VALUES ($1, $2, $3) RETURNING id",
                [other_category, 'indigo', 'Plus'] // Default color and icon for new categories
            );
            finalCategoryId = catRes.rows[0].id;
        }

        // 2. If 'others' type is selected, create it
        if (type_id === 'others' && other_type) {
            const typeRes = await client.query(
                "INSERT INTO service_types (category_id, name) VALUES ($1, $2) RETURNING id",
                [finalCategoryId, other_type]
            );
            finalTypeId = typeRes.rows[0].id;
        }

        // 3. Create the service in the global catalog
        const svcRes = await client.query(
            `INSERT INTO services (type_id, sub_type_id, name, description, base_price, image_url, features, provider_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [finalTypeId, data.sub_type_id || null, name, description, price, image_url, JSON.stringify(features || []), providerId]
        );

        const serviceId = svcRes.rows[0].id;

        // 4. Link it to the provider
        const res = await client.query(
            `INSERT INTO provider_services (provider_id, service_id, price)
             VALUES ($1, $2, $3) RETURNING *`,
            [providerId, serviceId, price]
        );

        await client.query('COMMIT');

        // Return full info for frontend
        return {
            ...res.rows[0],
            name,
            description,
            image_url,
            features,
            category_id: finalCategoryId,
            type_id: finalTypeId
        };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

exports.updateService = async (id, providerId, data) => {
    const { name, description, image_url, price, is_active } = data;
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. Find the global service_id associated with this provider_service
        const linkRes = await client.query(
            "SELECT service_id FROM provider_services WHERE id = $1 AND provider_id = $2",
            [id, providerId]
        );

        if (linkRes.rows.length === 0) {
            throw new Error("Service link not found");
        }

        const serviceId = linkRes.rows[0].service_id;

        // 2. Check ownership of the global service
        const serviceRes = await client.query(
            "SELECT provider_id FROM services WHERE id = $1",
            [serviceId]
        );

        const isOwner = serviceRes.rows[0]?.provider_id === providerId;

        // 3. Update global service info ONLY if owner (Custom Service)
        if (isOwner) {
            await client.query(
                `UPDATE services 
                 SET name = COALESCE($1, name),
                     description = COALESCE($2, description),
                     image_url = COALESCE($3, image_url),
                     base_price = COALESCE($5, base_price)
                 WHERE id = $4`,
                [name, description, image_url, serviceId, price]
            );
        }

        // 4. Update provider-specific info (price, status) - Allowed for everyone
        const res = await client.query(
            `UPDATE provider_services 
             SET price = COALESCE($1, price), 
                 is_active = COALESCE($2, is_active)
             WHERE id = $3 AND provider_id = $4 RETURNING *`,
            [price, is_active, id, providerId]
        );

        // Fetch fresh service details to return complete object
        const freshService = await client.query(
            "SELECT * FROM services WHERE id = $1",
            [serviceId]
        );

        await client.query('COMMIT');
        return {
            ...res.rows[0],
            name: freshService.rows[0].name,
            description: freshService.rows[0].description,
            image_url: freshService.rows[0].image_url
        };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

exports.deleteService = async (id, providerId) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. Get the service_id from the provider_service record
        const linkRes = await client.query(
            "SELECT service_id FROM provider_services WHERE id = $1 AND provider_id = $2",
            [id, providerId]
        );

        if (linkRes.rows.length === 0) {
            // Already deleted or not found
            await client.query('ROLLBACK');
            return;
        }

        const serviceId = linkRes.rows[0].service_id;

        // 2. Delete the link (provider_services record) - This removes it from the provider's dashboard
        await client.query(
            "DELETE FROM provider_services WHERE id = $1 AND provider_id = $2",
            [id, providerId]
        );

        // 3. Check ownership of the global service
        const serviceRes = await client.query(
            "SELECT provider_id FROM services WHERE id = $1",
            [serviceId]
        );

        const isOwner = serviceRes.rows[0]?.provider_id === providerId;

        // 4. If owner, DELETE the global service (Custom Service Cleanup)
        if (isOwner) {
            // Check if ANY other provider is using this service (unlikely for custom, but good safety)
            const otherLinks = await client.query(
                "SELECT id FROM provider_services WHERE service_id = $1",
                [serviceId]
            );

            if (otherLinks.rows.length === 0) {
                await client.query("DELETE FROM services WHERE id = $1", [serviceId]);
            }
        }

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

exports.toggleService = async (id, providerId) => {
    const res = await db.query(
        `UPDATE provider_services 
         SET is_active = NOT is_active 
         WHERE id = $1 AND provider_id = $2 RETURNING *`,
        [id, providerId]
    );
    return res.rows[0];
};

// --- CATALOG MANAGEMENT ---

exports.getCategories = async (providerId) => {
    // ALWAYS return all categories so providers can choose from them
    const query = `SELECT * FROM service_categories ORDER BY name ASC`;
    const params = [];

    const res = await db.query(query, params);
    return res.rows;
};

exports.getTypes = async (categoryId) => {
    const res = await db.query("SELECT * FROM service_types WHERE category_id = $1 ORDER BY name ASC", [categoryId]);
    return res.rows;
};

exports.getCatalogServices = async (typeId, providerId) => {
    // If providerId is null, return ALL services for this type (Marketplace view)
    // If providerId is set, return system services + this provider's services
    let query;
    let params;

    if (providerId) {
        // Specific provider's services
        // Specific provider's services - Return ALL services in type, but mark linked ones
        query = `SELECT s.*, 
                        ps.id as link_id, ps.price as my_price, ps.is_active as my_status,
                        sp.company_name as provider_name
                 FROM services s
                 LEFT JOIN provider_services ps ON s.id = ps.service_id AND ps.provider_id = $2
                 LEFT JOIN service_providers sp ON s.provider_id = sp.id
                 WHERE s.type_id = $1 
                 ORDER BY s.name ASC`;
        params = [typeId, providerId];
    } else {
        // ALL provider offerings (Marketplace)
        query = `SELECT ps.price, s.*, sp.company_name as provider_name, ps.provider_id
                 FROM services s
                 JOIN provider_services ps ON s.id = ps.service_id
                 JOIN service_providers sp ON ps.provider_id = sp.id
                 WHERE s.type_id = $1 
                 AND ps.is_active = true
                 ORDER BY s.name ASC`;
        params = [typeId];
    }

    const res = await db.query(query, params);
    return res.rows;
};

exports.getCatalogServicesBySubType = async (subTypeId, providerId) => {
    let query;
    let params;

    if (providerId) {
        // Return ALL services in subtype, with link info if exists for this provider
        query = `SELECT s.*, 
                        ps.id as link_id, ps.price as my_price, ps.is_active as my_status, ps.provider_id as linked_provider_id,
                        sp.company_name as provider_name
                 FROM services s
                 LEFT JOIN provider_services ps ON s.id = ps.service_id AND ps.provider_id = $2
                 LEFT JOIN service_providers sp ON s.provider_id = sp.id
                 WHERE s.sub_type_id = $1
                 ORDER BY s.name ASC`;
        params = [subTypeId, providerId];
    } else {
        // Validation/Marketplace View (No user context)
        query = `SELECT s.*, sp.company_name as provider_name
                 FROM services s
                 LEFT JOIN service_providers sp ON s.provider_id = sp.id
                 WHERE s.sub_type_id = $1
                 ORDER BY s.name ASC`;
        params = [subTypeId];
    }
    const res = await db.query(query, params);
    return res.rows;
};


exports.getServicesByCategory = async (categoryId) => {
    // Fetch all ACTIVE provider services belonging to a category
    // Join services -> provider_services -> service_providers -> service_types -> service_categories
    const res = await db.query(
        `SELECT ps.price, s.*, sp.company_name as provider_name, ps.provider_id, 
                st.name as type_name, sc.name as category_name
         FROM services s
         JOIN provider_services ps ON s.id = ps.service_id
         JOIN service_providers sp ON ps.provider_id = sp.id
         JOIN service_types st ON s.type_id = st.id
         JOIN service_categories sc ON st.category_id = sc.id
         WHERE sc.id = $1 AND ps.is_active = true
         ORDER BY st.name ASC, s.name ASC`,
        [categoryId]
    );
    return res.rows;
};


exports.addCategory = async (data) => {
    const { name, image_url, icon_name, color, description, provider_id } = data;
    const res = await db.query(
        "INSERT INTO service_categories (name, image_url, icon_name, color, description, provider_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, image_url, icon_name, color, description, provider_id]
    );
    return res.rows[0];
};

exports.updateCategory = async (id, data) => {
    const { name, image_url, icon_name, color, description } = data;
    const res = await db.query(
        "UPDATE service_categories SET name = $1, image_url = $2, icon_name = $3, color = $4, description = $5 WHERE id = $6 RETURNING *",
        [name, image_url, icon_name, color, description, id]
    );
    return res.rows[0];
};

exports.deleteCategory = async (id) => {
    await db.query("DELETE FROM service_categories WHERE id = $1", [id]);
};

exports.addType = async (data) => {
    const { category_id, name, image_url, description } = data;
    const res = await db.query(
        "INSERT INTO service_types (category_id, name, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [category_id, name, image_url, description]
    );
    return res.rows[0];
};

exports.updateType = async (id, data) => {
    const { name, image_url, description } = data;
    const res = await db.query(
        "UPDATE service_types SET name = $1, image_url = $2, description = $3 WHERE id = $4 RETURNING *",
        [name, image_url, description, id]
    );
    return res.rows[0];
};

exports.deleteType = async (id) => {
    await db.query("DELETE FROM service_types WHERE id = $1", [id]);
};

exports.addSubType = async (data) => {
    const { type_id, name, image_url, description } = data;
    const res = await db.query(
        "INSERT INTO service_sub_types (type_id, name, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [type_id, name, image_url || null, description || null]
    );
    return res.rows[0];
};

exports.updateSubType = async (id, data) => {
    const { name, image_url, description } = data;
    const res = await db.query(
        "UPDATE service_sub_types SET name = $1, image_url = $2, description = $3 WHERE id = $4 RETURNING *",
        [name, image_url || null, description || null, id]
    );
    return res.rows[0];
};

exports.deleteSubType = async (id) => {
    await db.query("DELETE FROM service_sub_types WHERE id = $1", [id]);
};

exports.getSubTypes = async (typeId) => {
    const res = await db.query("SELECT * FROM service_sub_types WHERE type_id = $1 ORDER BY name ASC", [typeId]);
    return res.rows;
};

exports.getCatalogServicesBySubType = async (subTypeId) => {
    const res = await db.query("SELECT * FROM services WHERE sub_type_id = $1 ORDER BY name ASC", [subTypeId]);
    return res.rows;
};

exports.addCatalogService = async (data) => {
    const { type_id, name, description, base_price, image_url, features } = data;
    const res = await db.query(
        "INSERT INTO services (type_id, sub_type_id, name, description, base_price, image_url, features, provider_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [type_id, data.sub_type_id || null, name, description, base_price, image_url, JSON.stringify(features || []), data.provider_id || null]
    );
    return res.rows[0];
};

exports.getBookings = async (providerId) => {
    const res = await db.query(
        `SELECT sr.id, sr.tenant_id, sr.user_id, sr.service_id, sr.assigned_provider_id, sr.status, sr.priority,
                sr.address, sr.payment_method, sr.amount, sr.scheduled_date as booking_date, sr.scheduled_time as booking_time,
                sr.created_at,
                u.first_name || ' ' || u.last_name as customer, s.name as service,
                COALESCE(sc.name, 'General') as category_name,
                COALESCE(st.name, 'Standard') as type_name
         FROM service_requests sr
         LEFT JOIN tenants t ON sr.tenant_id = t.id
         JOIN users u ON sr.user_id = u.id
         LEFT JOIN services s ON sr.service_id = s.id
         LEFT JOIN service_types st ON s.type_id = st.id
         LEFT JOIN service_categories sc ON st.category_id = sc.id
         WHERE sr.assigned_provider_id = $1
         ORDER BY sr.created_at DESC`,
        [providerId]
    );
    return res.rows;
};

exports.getStats = async (providerId) => {
    const services = await db.query(
        `SELECT COUNT(DISTINCT s.name) 
         FROM provider_services ps 
         JOIN services s ON ps.service_id = s.id 
         WHERE ps.provider_id = $1`,
        [providerId]
    );
    const activeServices = await db.query(
        `SELECT COUNT(DISTINCT s.name) 
         FROM provider_services ps 
         JOIN services s ON ps.service_id = s.id 
         WHERE ps.provider_id = $1 AND ps.is_active = true`,
        [providerId]
    );
    const pendingJobs = await db.query("SELECT COUNT(*) FROM service_requests WHERE assigned_provider_id = $1 AND status = 'Assigned'", [providerId]);
    const totalEarnings = await db.query("SELECT SUM(amount) FROM service_requests WHERE assigned_provider_id = $1 AND status = 'Completed'", [providerId]);

    return {
        totalServices: parseInt(services.rows[0].count),
        activeServices: parseInt(activeServices.rows[0].count),
        pendingJobs: parseInt(pendingJobs.rows[0].count),
        totalEarnings: parseFloat(totalEarnings.rows[0].sum || 0)
    };
};

exports.updateBookingStatus = async (bookingId, providerId, status, rejectionReason) => {
    const res = await db.query(
        `UPDATE service_requests 
         SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3 AND assigned_provider_id = $4 RETURNING *`,
        [status, rejectionReason || null, bookingId, providerId]
    );
    return res.rows[0];
};

exports.getBookingDetails = async (bookingId) => {
    const res = await db.query(
        `SELECT sr.id, sr.tenant_id, sr.user_id, sr.service_id, sr.assigned_provider_id, sr.status, sr.priority,
                sr.address, sr.payment_method, sr.amount, sr.scheduled_date as booking_date, sr.scheduled_time as booking_time,
                sr.created_at,
                u.email, u.first_name || ' ' || u.last_name as user_name,
                s.name as service_name,
                COALESCE(sc.name, 'General') as category_name,
                COALESCE(st.name, 'Standard') as type_name,
                sp.company_name as provider_name,
                sp.phone as provider_phone,
                sp.phone_number as provider_phone_alt
         FROM service_requests sr
         JOIN users u ON sr.user_id = u.id
         LEFT JOIN services s ON sr.service_id = s.id
         LEFT JOIN service_types st ON s.type_id = st.id
         LEFT JOIN service_categories sc ON st.category_id = sc.id
         JOIN service_providers sp ON sr.assigned_provider_id = sp.id
         WHERE sr.id = $1`,
        [bookingId]
    );
    return res.rows[0];
};
exports.getReviews = async (providerId) => {
    const res = await db.query(
        `SELECT r.id, r.rating, r.comment, r.created_at as date,
                u.first_name || ' ' || u.last_name as user, u.avatar_url as avatar
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.provider_id = $1
         ORDER BY r.created_at DESC`,
        [providerId]
    );
    return res.rows;
};
