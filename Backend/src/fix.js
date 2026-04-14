const db = require('./config/db');
async function fix() {
    try {
        await db.query("UPDATE service_categories SET provider_id = NULL WHERE name ILIKE '%Ac and Appliance repair%' OR name ILIKE '%Home Cleaning%'");
        console.log('Fixed');
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
fix();
