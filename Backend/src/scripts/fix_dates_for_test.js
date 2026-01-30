const db = require("../config/db");

const fixDates = async () => {
    try {
        console.log(" Fixing Tenant Dates for Testing...");

        // Set start_date to a year ago so the 30-day buffer is definitely passed.
        // This effectively "activates" the rent due dates for the current month.
        await db.query(`
      UPDATE tenants 
      SET start_date = '2025-01-01'
      WHERE id IN (1, 2)
    `); // Targeting IDs 1 and 2 from the screenshot

        console.log("✅ Dates updated! Start Date is now 2025-01-01.");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
};

fixDates();
