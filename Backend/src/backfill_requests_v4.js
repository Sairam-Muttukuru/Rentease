const db = require("./config/db");
async function backfill() {
    try {
        console.log("Backfilling service_requests via user_id -> tenants...");
        const res = await db.query(`
            UPDATE service_requests
            SET
                tenant_id = COALESCE(service_requests.tenant_id, t.id),
                landlord_id = COALESCE(service_requests.landlord_id, t.landlord_id),
                property_id = COALESCE(service_requests.property_id, t.property_id),
                customer_email = COALESCE(service_requests.customer_email, u.email),
                booking_date = COALESCE(service_requests.booking_date, service_requests.scheduled_date),
                booking_time = COALESCE(service_requests.booking_time, CAST(service_requests.scheduled_time AS CHARACTER VARYING))
            FROM users u
            LEFT JOIN tenants t ON t.user_id = u.id
            WHERE service_requests.user_id = u.id
            AND (service_requests.landlord_id IS NULL OR service_requests.customer_email IS NULL OR service_requests.booking_date IS NULL)
        `);
        console.log(`Updated ${res.rowCount} rows via user_id mapping.`);

        process.exit(0);
    } catch (err) {
        console.error("BACKFILL ERROR:" + JSON.stringify(err));
        process.exit(1);
    }
}
backfill();
