const db = require('../src/config/db');
async function repair() {
    try {
        // Fix the specific user's rent_due_date to match their start_date
        const res = await db.query(`
            UPDATE tenants 
            SET rent_due_date = start_date 
            WHERE user_id = (SELECT id FROM users WHERE email = '22711a05b3@necn.ac.in')
            RETURNING id, start_date, rent_due_date
        `);
        console.log("Repair success:", JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
repair();
