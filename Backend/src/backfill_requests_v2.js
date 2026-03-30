const db = require("./config/db");
async function backfill() {
    try {
        console.log("Backfilling service_requests...");
        const res = await db.query(`
            UPDATE service_requests
            SET
                landlord_id = t.landlord_id,
                property_id = t.property_id,
                customer_email = u.email,
                booking_date = COALESCE(service_requests.booking_date, service_requests.scheduled_date),
                booking_time = COALESCE(service_requests.booking_time, service_requests.scheduled_time)
            FROM tenants t
            JOIN users u ON t.user_id = u.id
            WHERE service_requests.tenant_id = t.id
            AND (service_requests.landlord_id IS NULL OR service_requests.property_id IS NULL OR service_requests.customer_email IS NULL)
        `);
        console.log(`Updated ${res.rowCount} rows via tenants.`);

        const res2 = await db.query(`
            UPDATE service_requests
            SET
                customer_email = u.email,
                booking_date = COALESCE(service_requests.booking_date, service_requests.scheduled_date),
                booking_time = COALESCE(service_requests.booking_time, service_requests.scheduled_time)
            FROM users u
            WHERE service_requests.user_id = u.id
            AND service_requests.customer_email IS NULL
        `);
        console.log(`Updated ${res2.rowCount} rows for user_id mapping.`);

        process.exit(0);
    } catch (err) {
        console.error("BACKFILL ERROR:" + JSON.stringify(err));
        process.exit(1);
    }
}
backfill();
