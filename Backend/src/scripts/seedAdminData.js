const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = async () => {
    try {
        console.log("🌱 Starting Seed Process...");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // 0. Clean Clean
        console.log("Cleaning Database...");
        await db.query("TRUNCATE TABLE users, properties, service_providers, complaints, rent_payments, admin_audit_logs RESTART IDENTITY CASCADE");

        // 1. Users (Admin, Landlords, Tenants)
        console.log("Creating Users...");

        // Admin
        await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) 
            VALUES ('admin@rentease.com', $1, 'ADMIN', 'Super', 'Admin', 'Active')`, [hashedPassword]);

        // Landlords
        const landlords = [
            ['sarah@landlord.com', 'Sarah', 'Smith', 'Active'],
            ['mike@landlord.com', 'Mike', 'Johnson', 'Active'],
            ['anna@landlord.com', 'Anna', 'Williams', 'Active']
        ];

        const landlordIds = [];
        for (const l of landlords) {
            const res = await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) 
                VALUES ($1, $2, 'LANDLORD', $3, $4, $5) RETURNING id`, [l[0], hashedPassword, l[1], l[2], l[3]]);
            landlordIds.push(res.rows[0].id);
        }
        console.log(`Created ${landlordIds.length} Landlords:`, landlordIds);

        // Tenants
        const tenants = [
            ['john@tenant.com', 'John', 'Doe', 'Active'],
            ['jane@tenant.com', 'Jane', 'Doe', 'Active'],
            ['robert@tenant.com', 'Robert', 'Brown', 'Blocked'],
            ['emily@tenant.com', 'Emily', 'Davis', 'Active']
        ];

        const tenantUserIds = [];
        for (const t of tenants) {
            const res = await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) 
                VALUES ($1, $2, 'TENANT', $3, $4, $5) RETURNING id`, [t[0], hashedPassword, t[1], t[2], t[3]]);
            tenantUserIds.push(res.rows[0].id);
        }
        console.log(`Created ${tenantUserIds.length} Tenant Users`);

        // 2. Properties
        console.log("Creating Properties...");
        const properties = [
            ['Luxury Downtown Apt', 'Downtown', 'New York', 25000, 'Occupied', 'Apartment'],
            ['Sunny Villa', 'Santa Monica', 'Los Angeles', 45000, 'Occupied', 'Villa'],
            ['Cozy Studio', 'Brooklyn', 'New York', 15000, 'Vacant', 'Studio'],
            ['Modern Loft', 'Mission District', 'San Francisco', 32000, 'Vacant', 'Apartment'],
            ['Suburban Home', 'Queens', 'New York', 28000, 'Occupied', 'House']
        ];

        const propIds = [];
        for (let i = 0; i < properties.length; i++) {
            const p = properties[i];
            const landlordId = landlordIds[i % landlordIds.length];
            const res = await db.query(`INSERT INTO properties (title, locality, city, price, status, property_type, landlord_id, area)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 1200) RETURNING id`,
                [p[0], p[1], p[2], p[3], p[4], p[5], landlordId]);
            propIds.push(res.rows[0].id);
        }
        console.log(`Created ${propIds.length} Properties:`, propIds);

        // 3. Service Providers
        console.log("Creating Service Providers...");
        const providerUsers = [
            ['provider1@fastfix.com', 'Fast', 'Fix'],
            ['provider2@volton.com', 'Volt', 'On'],
            ['provider3@cleansweep.com', 'Clean', 'Sweep']
        ];

        const providerIds = [];
        for (const p of providerUsers) {
            const res = await db.query(`INSERT INTO users (email, password, role, first_name, last_name, status) 
                VALUES ($1, $2, 'SERVICE_PROVIDER', $3, $4, 'Active') RETURNING id`, [p[0], hashedPassword, p[1], p[2]]);
            const userId = res.rows[0].id;

            const pRes = await db.query(`INSERT INTO service_providers (company_name, service_type, phone, service_area, status, user_id)
                VALUES ($1, $2, $3, $4, 'Active', $5) RETURNING id`,
                [`${p[1]}Corp`, 'Plumbing', '555-0100', 'City', userId]);
            providerIds.push(pRes.rows[0].id);
        }

        // 3.5. Tenants Link
        console.log("Creating Tenants Links...");
        const tenantIds = [];
        const loopCount = Math.min(tenantUserIds.length, propIds.length);

        for (let i = 0; i < loopCount; i++) {
            const rentDueDate = new Date();
            rentDueDate.setDate(rentDueDate.getDate() + 5);

            // Explicitly get landlord_id for the property first
            const propId = propIds[i];
            console.log(`Processing Tenant ${i}, PropId: ${propId} (${typeof propId})`);

            const lRes = await db.query("SELECT landlord_id FROM properties WHERE id=$1", [propId]);
            const lId = lRes.rows[0].landlord_id;
            console.log(`  LandlordId: ${lId} (${typeof lId})`);

            console.log(`  RentDueDate: ${rentDueDate} (${typeof rentDueDate}, isInstance: ${rentDueDate instanceof Date})`);

            const tRes = await db.query(`
                 INSERT INTO tenants (user_id, property_id, landlord_id, monthly_rent, tenant_type)
                 VALUES ($1, $2, $3, 25000, 'Family')
                 RETURNING id
              `, [tenantUserIds[i], propId, lId]);
            tenantIds.push(tRes.rows[0].id);
        }
        console.log(`Created ${tenantIds.length} Tenant Links:`, tenantIds);

        // 4. Complaints
        console.log("Creating Complaints...");
        if (tenantIds.length > 0 && propIds.length > 0) {
            const pId1 = propIds[0];
            const pId2 = propIds[1] || propIds[0];
            const tId = tenantIds[0];
            const lId = landlordIds[0];

            console.log(`Inserting complaints with P1:${pId1}, P2:${pId2}, T:${tId}, L:${lId}`);

            await db.query(`INSERT INTO complaints (property_id, tenant_id, category, description, priority_level, status, title, landlord_id)
                 VALUES ($1, $2, 'Plumbing', 'Leaking sink', 'High', 'Open', 'Leaky Sink', $3)`,
                [pId1, tId, lId]);

            await db.query(`INSERT INTO complaints (property_id, tenant_id, category, description, priority_level, status, title, landlord_id)
                 VALUES ($1, $2, 'Electrical', 'Light flickering', 'Medium', 'In Progress', 'Flickering', $3)`,
                [pId2, tId, lId]);

            await db.query(`INSERT INTO complaints (property_id, tenant_id, category, description, priority_level, status, title, landlord_id)
                 VALUES ($1, $2, 'Appliance', 'AC Issue', 'Low', 'Resolved', 'AC', $3)`,
                [pId1, tId, lId]);

            // 5. Payments
            console.log("Creating Payments...");
            await db.query(`INSERT INTO rent_payments (transaction_id, amount, payment_date, status, tenant_id, property_id, type)
                 VALUES 
                 ('TXN-1001', 25000, NOW() - INTERVAL '2 days', 'Completed', $1, $2, 'Rent'),
                 ('TXN-1002', 45000, NOW() - INTERVAL '5 days', 'Completed', $1, $3, 'Rent'),
                 ('TXN-1003', 15000, NOW() - INTERVAL '10 days', 'Completed', $1, $2, 'Service')`,
                [tId, pId1, pId2]);
        }

        // 6. Audit Logs
        console.log("Creating Audit Logs...");
        const adminRes = await db.query("SELECT id FROM users WHERE role='ADMIN'");
        const adminId = adminRes.rows[0].id;

        await db.query(`INSERT INTO admin_audit_logs (action, admin_id, created_at)
            VALUES ($1, $2, NOW())`, ['System Initialized', adminId]);

        console.log("✅ Robust Seed Completed!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seed Failed:", err);
        process.exit(1);
    }
};

seedData();
