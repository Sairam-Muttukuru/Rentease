const db = require("../config/db");

const checkUserRole = async () => {
    try {
        console.log("🔍 Checking 'users' role column...");
        const res = await db.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
        `);
        console.log("Column Info:", res.rows[0]);

        // Check for check constraints
        console.log("\n🔍 Checking Constraints on 'users'...");
        const constraints = await db.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c 
            JOIN pg_namespace n ON n.oid = c.connamespace 
            WHERE conrelid = 'users'::regclass
        `);
        constraints.rows.forEach(c => console.log(`${c.conname}: ${c.pg_get_constraintdef}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUserRole();
