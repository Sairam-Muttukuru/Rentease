const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");

const forceFixAndRun = async () => {
    console.log("🚀 Starting Force Fix and Run...");

    try {
        // --- STEP 1: FIX DATES ---
        console.log("🛠️  Step 1: Updating Tenant Dates to 2025-01-01...");
        const updateResult = await db.query(`
            UPDATE tenants 
            SET start_date = '2025-01-01'
            WHERE id IN (1, 2)
            RETURNING id, start_date;
        `);
        console.log("✅ Update Result:", updateResult.rows);

        if (updateResult.rows.length === 0) {
            console.log("⚠️  No rows updated! Checking IDs...");
            const allTenants = await db.query("SELECT id, start_date FROM tenants");
            console.log("Current Tenants in DB:", allTenants.rows);
        }

        // --- STEP 2: RUN TRIGGER ---
        console.log("\n🔔 Step 2: Running Trigger Logic...");

        const result = await db.query(`
            SELECT 
                t.id,
                t.start_date,
                t.payment_status,
                t.last_reminder_sent_at,
                t.monthly_rent,
                t.rent_due_date,
                u.email,
                u.first_name,
                l.first_name AS landlord_first_name,
                l.last_name AS landlord_last_name
            FROM tenants t
            JOIN users u ON u.id = t.user_id
            JOIN properties p ON p.id = t.property_id
            JOIN users l ON l.id = p.landlord_id
            WHERE t.payment_status != 'PAID'
        `);

        console.log(`Found ${result.rows.length} unpaid tenants for processing.`);

        const todayDate = new Date(); // Should be 2026-01-21
        const todayStr = todayDate.toISOString().split("T")[0];
        console.log(`Current System Date: ${todayStr}`);

        for (const tenant of result.rows) {
            console.log(`\nProcessing Tenant: ${tenant.first_name} (ID: ${tenant.id})`);

            if (!tenant.rent_due_date) {
                console.log(`  - No rent_due_date, skipping.`);
                continue;
            }

            // Logic Re-implementation
            let targetYear = todayDate.getFullYear();
            let targetMonth = todayDate.getMonth();
            let dueDay = parseInt(tenant.rent_due_date);
            let targetDueDate = new Date(targetYear, targetMonth, dueDay);

            const startDate = new Date(tenant.start_date); // should be 2025-01-01
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            console.log(`  - Start Date: ${startDate.toISOString().split('T')[0]}`);
            console.log(`  - Min Due Date: ${minDueDate.toISOString().split('T')[0]}`);
            console.log(`  - Initial Target: ${targetDueDate.toISOString().split('T')[0]}`);

            let loops = 0;
            while ((targetDueDate < minDueDate || targetDueDate < todayDate) && loops < 24) {
                // Important: Loop logic check.
                // If Target (Jan 22) < Today (Jan 21) ? NO.
                // If Target (Jan 22) < Min (Jan 31, 2025) ? NO.
                // So it should NOT enter loop for Tenant 2.
                // For Tenant 1: Target (Jan 23) < Today (Jan 21)? NO.
                // So it should stay in this month.

                // Wait, PREVIOUSLY I said Jan 22 < Jan 21 is False.
                // BUT: If the script runs late at night, UTC vs Local might issue?
                // "Current local time: 20:33".
                // "new Date()" uses local system time? Node usually uses UTC unless TZ is set.
                // If UTC is earlier/later... 
                // 8:30 PM IST = 3:00 PM UTC. Same day.

                console.log(`    - Loop: Target ${targetDueDate.toISOString().split('T')[0]} is too early/past. Moving to next month.`);
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
                loops++;
            }
            console.log(`  - Final Target Due: ${targetDueDate.toISOString().split('T')[0]}`);

            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(targetDueDate.getDate() - 3);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];
            console.log(`  - Reminder Date: ${reminderDateStr}`);

            // Check
            // Today: Jan 21. Reminder: Jan 19 (for Tenant 2 with due date 22).
            // Jan 21 >= Jan 19 AND Jan 21 <= Jan 22. -> TRUE.

            if (todayStr >= reminderDateStr && todayStr <= targetDueDate.toISOString().split("T")[0]) {
                console.log(`  MATCH! Sending email...`);

                const formattedDueDate = targetDueDate.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
                const landlordName = `${tenant.landlord_first_name} ${tenant.landlord_last_name}`;
                const html = rentReminderTemplate(tenant.first_name, tenant.monthly_rent, formattedDueDate, landlordName);

                await sendMail(tenant.email, "Rent Payment Reminder", html);
                console.log(`  ✅ Email SENT to ${tenant.email}`);
            } else {
                console.log(`  NO MATCH. Today (${todayStr}) is not in window [${reminderDateStr}, ${targetDueDate.toISOString().split("T")[0]}]`);
            }
        }

        console.log("\n🚀 Script Finished.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Fatal Error:", err);
        process.exit(1);
    }
};

forceFixAndRun();
