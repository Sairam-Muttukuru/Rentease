const { Pool } = require('pg');
require('dotenv').config({ path: './src/.env' });
const TenantService = require('./src/services/TenantService');

// Mock DB because Service uses models which import their own db config
// Actually, Service uses Models which assume global `db` variable or require it. 
// Looking at Models, they require `../config/db`.
// So we can just run a script that imports the service.

async function testFullAdd() {
    try {
        // 1. Get a landlord/property
        // We'll query passing a known landlord ID if possible, or just pick one.
        // For simplicity, let's assume we can query DB directly here to find a valid pair.

        // BUT, the Service imports Models which import '../config/db'. 
        // That config likely uses process.env.
        // So we need to make sure env is loaded.

        const db = require('./src/config/db');

        const propRes = await db.query("SELECT id, landlord_id FROM properties LIMIT 1");
        if (propRes.rows.length === 0) {
            console.log("No properties");
            return;
        }
        const { id: pid, landlord_id: lid } = propRes.rows[0];

        console.log(`Testing AddService for L:${lid} P:${pid}`);

        const data = {
            primary_member: {
                full_name: "Test Tenant Service",
                phone: "1234567890",
                email: "test.service@example.com"
            },
            tenant_type: "Family", // Mixed case to test conversion
            monthly_rent: 1500
        };

        const newTenant = await TenantService.addTenant(lid, pid, data);
        console.log("Service Success:", newTenant);

        // Cleanup
        await db.query("DELETE FROM tenant_members WHERE tenant_id = $1", [newTenant.id]);
        await db.query("DELETE FROM tenants WHERE id = $1", [newTenant.id]);

    } catch (err) {
        console.error("Service FAIL:", err);
    }
    // We might hang because db pool is open
    process.exit(0);
}

testFullAdd();
