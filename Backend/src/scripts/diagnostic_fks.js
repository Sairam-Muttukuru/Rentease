const db = require("../config/db");

const diagnostic = async () => {
    const client = await db.connect();
    try {
        console.log("--- Diagnostic Start ---");

        const tenantId = 3;
        const tenantCheck = await client.query("SELECT * FROM tenants WHERE id = $1", [tenantId]);
        console.log(`Tenant 3 exists: ${tenantCheck.rows.length > 0}`);
        if (tenantCheck.rows.length > 0) {
            console.log("Tenant Data:", JSON.stringify(tenantCheck.rows[0]));
        }

        const landlordId = 7;
        const userCheck = await client.query("SELECT * FROM users WHERE id = $1", [landlordId]);
        console.log(`User 7 exists: ${userCheck.rows.length > 0}`);

        const propId = 2;
        const propCheck = await client.query("SELECT * FROM properties WHERE id = $1", [propId]);
        console.log(`Property 2 exists: ${propCheck.rows.length > 0}`);

        console.log("\n--- service_requests Constraints Detail ---");
        const cons = await client.query(`
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='service_requests';
        `);
        console.table(cons.rows);

    } catch (err) {
        console.error("Diagnostic Error:", err);
    } finally {
        client.release();
        process.exit();
    }
};

diagnostic();
