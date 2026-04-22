const pool = require("../src/config/db");

async function fixEverything() {
    try {
        console.log("🚀 Starting comprehensive database field expansion...");
        
        // Expansion for rent_payments
        await pool.query(`
            ALTER TABLE rent_payments 
            ALTER COLUMN transaction_id TYPE VARCHAR(255),
            ALTER COLUMN receipt_number TYPE VARCHAR(255),
            ALTER COLUMN paid_by TYPE VARCHAR(255),
            ALTER COLUMN status TYPE VARCHAR(100),
            ALTER COLUMN payment_gateway TYPE VARCHAR(100);
        `);
        console.log("✅ Expanded rent_payments fields.");

        // Expansion for tenants
        await pool.query(`
            ALTER TABLE tenants 
            ALTER COLUMN payment_status TYPE VARCHAR(100),
            ALTER COLUMN security_deposit_status TYPE VARCHAR(100),
            ALTER COLUMN tenant_type TYPE VARCHAR(100);
        `);
        console.log("✅ Expanded tenants status fields.");

        // Expansion for notifications (just in case)
        await pool.query(`
            ALTER TABLE notifications 
            ALTER COLUMN type TYPE VARCHAR(100),
            ALTER COLUMN title TYPE VARCHAR(255);
        `);
        console.log("✅ Expanded notifications fields.");

        console.log("🎉 All fields expanded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Expansion failed:", err.message);
        process.exit(1);
    }
}

fixEverything();
