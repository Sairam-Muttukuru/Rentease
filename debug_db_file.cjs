const fs = require('fs');
const db = require('./Backend/src/config/db');

async function debugConstraint() {
    try {
        console.log("Querying database...");
        const res = await db.query(
            "SELECT check_clause FROM information_schema.check_constraints WHERE constraint_name = 'tenants_payment_status_check'"
        );
        console.log("Query complete. Rows:", res.rows.length);
        fs.writeFileSync('constraint_def.txt', JSON.stringify(res.rows, null, 2));
        console.log("Written to constraint_def.txt");
    } catch (err) {
        console.error("Error:", err);
        fs.writeFileSync('constraint_def.txt', "Error: " + err.message);
    } finally {
        process.exit(0);
    }
}

debugConstraint();
