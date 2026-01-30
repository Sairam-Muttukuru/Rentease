import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('./Backend/src/config/db.js');

async function check() {
    try {
        const res = await db.query("SELECT 1 FROM information_schema.tables WHERE table_name = 'complaint_images'");
        console.log('Exists:', res.rowCount > 0);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
