const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");

const robustFixAndRun = async () => {
    console.log("🚀 Starting Robust Fix and Run...");

    try {
        // --- STEP 1: FIND TENANTS BY USER_ID ---
        // From screenshot: Chelors (user_id 1), Mily (user_id 5)
        console.log("🔍 Finding tenants by user_id...");
        const findQuery = `SELECT id, user_id, start_date FROM tenants WHERE user_id IN (1, 5)`;
        const findResult = await db.query(findQuery);
        console.log("Found Tenants:", findResult.rows);

        const tenantIds = findResult.rows.map(t => t.id);

        if (tenantIds.length === 0) {
            console.error("❌ No tenants found with user_ids 1 or 5. Cannot proceed.");
            process.exit(1);
        }

        // --- STEP 2: FIX DATES ---
        console.log(`🛠️  Updating Start Date to 2025-01-01 for IDs: ${tenantIds.join(', ')}`);

        await db.query(`
            UPDATE tenants 
            SET start_date = '2025-01-01'
            WHERE id = ANY($1)
        `, [tenantIds]);

        console.log("✅ Dates Updated in DB.");

        // --- STEP 3: RUN LOGIC ---
        console.log("\n🔔 Running Reminder Logic...");

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
            WHERE t.id = ANY($1)
        `, [tenantIds]);

        const todayDate = new Date();
        const todayStr = todayDate.toISOString().split("T")[0];

        for (const tenant of result.rows) {
            console.log(`\nProcessing ${tenant.first_name} (Due: ${tenant.rent_due_date})...`);

            // Logic
            let targetYear = todayDate.getFullYear();
            let targetMonth = todayDate.getMonth();
            let dueDay = parseInt(tenant.rent_due_date);
            let targetDueDate = new Date(targetYear, targetMonth, dueDay);

            const startDate = new Date(tenant.start_date);
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            console.log(`  - Target: ${targetDueDate.toISOString().split('T')[0]}`);
            console.log(`  - MinDue: ${minDueDate.toISOString().split('T')[0]}`);

            while (targetDueDate < minDueDate || targetDueDate < todayDate) {
                // Check if it's REALLY late (time issue). 
                // If Target is Today (Jan 21) at 00:00, and Today is Jan 21 20:00.
                // Then Target < Today.
                // So it will skip to NEXT Month (Feb 21).
                // THIS IS A BUG in the logic if we want same-day reminders!
                // Fix: compares strings or set hours.

                // If targetDueDate date matches today's date, it shouldn't be considered "less than".
                const tStr = targetDueDate.toISOString().split('T')[0];
                if (tStr === todayStr) {
                    break; // valid!
                }

                // Standard logic
                if (targetDueDate < minDueDate || targetDueDate < todayDate) {
                    targetDueDate.setMonth(targetDueDate.getMonth() + 1);
                } else {
                    break;
                }
            }

            console.log(`  - Adjusted Target: ${targetDueDate.toISOString().split('T')[0]}`);

            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(targetDueDate.getDate() - 3);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];

            console.log(`  - Reminder Date: ${reminderDateStr}`);

            if (todayStr >= reminderDateStr && todayStr <= targetDueDate.toISOString().split("T")[0]) {
                console.log(`  ✅ SENDING EMAIL...`);

                const formattedDueDate = targetDueDate.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
                const landlordName = `${tenant.landlord_first_name} ${tenant.landlord_last_name}`;
                const html = rentReminderTemplate(tenant.first_name, tenant.monthly_rent, formattedDueDate, landlordName);

                await sendMail(tenant.email, "Rent Payment Reminder", html);
                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
            } else {
                console.log(`  ❌ No Send.`);
            }
        }

        console.log("Done.");
        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

robustFixAndRun();
