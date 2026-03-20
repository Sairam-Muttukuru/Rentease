const db = require("../Backend/src/config/db");

async function check() {
    try {
        const res = await db.query("SELECT * FROM tenants LIMIT 5");
        console.log("Tenants:", JSON.stringify(res.rows, null, 2));
        
        const schema = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tenants'
        `);
        console.log("Schema:", JSON.stringify(schema.rows, null, 2));
        
        const payments = await db.query("SELECT * FROM rent_payments LIMIT 5");
        console.log("Payments:", JSON.stringify(payments.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
