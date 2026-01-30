const db = require("../config/db");

const quickSeed = async () => {
    try {
        console.log("🚀 Quick Seeding...");

        // 1. Rent Payments (Revenue Graph)
        // Try inserting without tenant_id or property_id if nullable
        try {
            await db.query(`INSERT INTO rent_payments (amount, payment_date, status) VALUES (20000, NOW() - INTERVAL '2 days', 'Completed')`);
            await db.query(`INSERT INTO rent_payments (amount, payment_date, status) VALUES (45000, NOW() - INTERVAL '5 days', 'Completed')`);
            console.log("✅ Inserted Rent Payments (Simpler)");
        } catch (e) {
            console.log("⚠️ Rent Payment Simpler failed, trying with defaults?", e.message);
        }

        // 2. Complaints (Issues Graph)
        try {
            await db.query(`INSERT INTO complaints (category, description, priority_level, status, title) VALUES ('Plumbing', 'Test Issue', 'High', 'Open', 'Test Title')`);
            console.log("✅ Inserted Complaint (Simpler)");
        } catch (e) {
            console.log("⚠️ Complaint Simpler failed", e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Stats Failed:", err);
        process.exit(1);
    }
};

quickSeed();
