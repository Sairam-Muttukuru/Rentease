const db = require("../config/db");

async function checkProviders() {
    console.log("🔍 Checking Service Providers in DB...");
    try {
        const res = await db.query("SELECT * FROM service_providers");
        console.log(`Found ${res.rows.length} providers:`);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("❌ Error querying DB:", err);
    } finally {
        process.exit();
    }
}

checkProviders();
