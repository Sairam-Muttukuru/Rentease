const db = require("../config/db");

async function debugQuery() {
    console.log("🐞 Debugging SQL Query...");
    const query = `
    SELECT sp.*, u.first_name, u.last_name, u.email,
    (SELECT COUNT(*) FROM service_requests sr WHERE sr.provider_id = sp.id AND sr.status = 'Assigned') as active_jobs_count
    FROM service_providers sp
    JOIN users u ON sp.user_id = u.id
    ORDER BY sp.id DESC
    `;

    try {
        const res = await db.query(query);
        console.log("✅ Query successful!");
        console.log("Rows:", res.rows.length);
        if (res.rows.length > 0) console.log("Sample:", res.rows[0]);
    } catch (err) {
        console.error("❌ Query Failed:", err.message);
        console.error("Hint:", err.hint);
        console.error("Detail:", err.detail);
    } finally {
        process.exit();
    }
}

debugQuery();
