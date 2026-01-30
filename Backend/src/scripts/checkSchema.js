const db = require("../config/db");

const checkSchema = async () => {
    try {
        const res = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tenants';
        `);
        console.log("Tenants Table Columns:", res.rows.map(r => r.column_name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSchema();
