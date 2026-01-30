
const TenantService = require('../services/TenantService');
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function testAddTenant() {
    const landlordId = 24;
    const propertyId = 2;
    const data = {
        tenant_type: "Family",
        monthly_rent: 25000,
        payment_status: "Pending",
        start_date: "2026-01-01",
        rent_due_date: "2026-02-01",
        primary_member: {
            full_name: "Muttukuru Sairam",
            phone: "7013527597",
            email: "bhavanimuttukuru@gmail.com",
            relation: "Self"
        }
    };

    try {
        console.log("🚀 Testing addTenant service...");
        const tenant = await TenantService.addTenant(landlordId, propertyId, data);
        console.log("✅ Tenant added successfully:", tenant);
    } catch (err) {
        console.error("❌ FAILED to add tenant:", err.message);
        if (err.detail) console.error("Detail:", err.detail);
    } finally {
        process.exit();
    }
}

testAddTenant();
