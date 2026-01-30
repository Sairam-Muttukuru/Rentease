const db = require("../config/db");

const checkConstraints = async () => {
    try {
        console.log("🔍 Checking 'tenants' NOT NULL columns...");
        const res = await db.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'tenants' AND is_nullable = 'NO'
        `);
        console.log("NOT NULL Columns:");
        const fs = require('fs');
        const constraints = await db.query(`
            SELECT conrelid::regclass as table_name, conname, pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE c.conrelid IN ('public.tenants'::regclass, 'public.tenant_members'::regclass)
            AND c.contype = 'c';
        `);

        fs.writeFileSync('constraints.json', JSON.stringify(constraints.rows, null, 2));
        console.log("Written to constraints.json");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkConstraints();
