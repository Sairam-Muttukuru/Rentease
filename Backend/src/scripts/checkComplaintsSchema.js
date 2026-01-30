const db = require("../config/db");

const checkRentPayments = async () => {
    try {
        console.log("🔍 Checking 'rent_payments' table schema...");
        const res = await db.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'rent_payments'
        `);
        console.log("Columns:");
        res.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type} (Nullable: ${r.is_nullable})`));
        process.exit(0);
    } catch (err) {
        console.error("❌ Stats Failed:", err);
        process.exit(1);
    }
};

checkRentPayments();
