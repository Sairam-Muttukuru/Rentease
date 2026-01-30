const db = require("../config/db");
const bcrypt = require("bcryptjs");

const forceSeed = async () => {
    try {
        console.log("🔨 Force Seeding (Linear)...");

        // 0. Clean (Optional - remove if you want to keep existing)
        await db.query("TRUNCATE TABLE users, properties, service_providers, complaints, rent_payments, admin_audit_logs RESTART IDENTITY CASCADE");

        // 1. Create 1 Landlord
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("password", salt);
        const lRes = await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) VALUES ('landlord@test.com', $1, 'LANDLORD', 'L', 'L', 'Active') RETURNING id`, [hash]);
        const lId = lRes.rows[0].id;
        console.log("✅ Landlord:", lId);

        // 2. Create 1 Property
        const pRes = await db.query(`INSERT INTO properties (title, locality, city, price, status, property_type, landlord_id, area) VALUES ('Test Prop', 'Loc', 'City', 10000, 'Occupied', 'Apt', $1, 1000) RETURNING id`, [lId]);
        const pId = pRes.rows[0].id;
        console.log("✅ Property:", pId);

        // 3. Create 1 Tenant User
        const tUserRes = await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) VALUES ('tenant@test.com', $1, 'TENANT', 'T', 'T', 'Active') RETURNING id`, [hash]);
        const tUserId = tUserRes.rows[0].id;
        console.log("✅ Tenant User:", tUserId);

        // 4. Create Tenant Link
        // Try minimal columns first
        const tRes = await db.query(`
            INSERT INTO tenants (user_id, property_id, landlord_id, monthly_rent, tenant_type) 
            VALUES ($1, $2, $3, 10000, 'Family') 
            RETURNING id
        `, [tUserId, pId, lId]);
        const tId = tRes.rows[0].id;
        console.log("✅ Tenant Link:", tId);

        // 5. Create Payment (Revenue)
        await db.query(`INSERT INTO rent_payments (transaction_id, amount, payment_date, status, tenant_id, property_id, type) VALUES ('TXN-1', 10000, NOW(), 'Completed', $1, $2, 'Rent')`, [tId, pId]);
        console.log("✅ Payment");

        // 6. Create Complaint (Issue)
        await db.query(`INSERT INTO complaints (property_id, tenant_id, landlord_id, category, description, title, priority_level, status) VALUES ($1, $2, $3, 'Plumbing', 'Desc', 'Title', 'High', 'Open')`, [pId, tId, lId]);
        console.log("✅ Complaint");

        process.exit(0);
    } catch (err) {
        console.error("❌ Force Seed Failed:", err);
        process.exit(1);
    }
};

forceSeed();
