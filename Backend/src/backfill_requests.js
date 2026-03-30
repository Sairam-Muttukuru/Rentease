const db = require("./config/db");
async function backfill() {
    try {
        console.log("Backfilling landlord_id and property_id in service_requests...");
        const res = await db.query(`
            UPDATE service_requests sr
            SET
                landlord_id = t.landlord_id,
                property_id = t.property_id,
                customer_email = u.email,
                booking_date = COALESCE(sr.booking_date, sr.scheduled_date),
                booking_time = COALESCE(sr.booking_time, sr.scheduled_time)
            FROM tenants t
            JOIN users u ON t.user_id = u.id
            WHERE sr.tenant_id = t.id
            AND (sr.landlord_id IS NULL OR sr.property_id IS NULL OR sr.customer_email IS NULL)
        `);
        console.log(`Updated ${res.rowCount} rows.`);

        // Handle cases where sr.user_id is set instead of tenant_id
        const res2 = await db.query(`
            UPDATE service_requests sr
            SET
                customer_email = u.email,
                booking_date = COALESCE(sr.booking_date, sr.scheduled_date),
                booking_time = COALESCE(sr.booking_time, sr.scheduled_time)
            FROM users u
            WHERE sr.user_id = u.id
            AND sr.customer_email IS NULL
        `);
        console.log(`Updated ${res2.rowCount} rows for user_id mapping.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
backfill();
