const db = require('./config/db');
async function see() {
    try {
        const categories = await db.query("SELECT id, name, provider_id FROM service_categories");
        require('fs').writeFileSync('cats2.json', JSON.stringify(categories.rows, null, 2));

        const services = await db.query("SELECT id, name, provider_id, type_id FROM services");
        require('fs').writeFileSync('services.json', JSON.stringify(services.rows, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
see();
