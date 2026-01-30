const db = require('./Backend/src/config/db');

async function debugConstraint() {
    try {
        const res = await db.query(
            "SELECT check_clause FROM information_schema.check_constraints WHERE constraint_name = 'tenants_payment_status_check'"
        );
        console.log("CONSTRAINT DEFINITION:", res.rows);
    } catch (err) {
        console.error(err);
    }
}

debugConstraint();
