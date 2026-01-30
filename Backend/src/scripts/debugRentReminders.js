const db = require("../config/db");
// Mock sendMail to just log
const sendMail = async (to, subject, html) => {
    console.log(`[MOCK EMAIL] would send to ${to} with subject "${subject}"`);
};
const { rentReminderTemplate } = require("../utils/emailTemplates");

const runDebug = async () => {
    console.log("🔔 Rent Reminder DEBUG Started");

    try {
        const todayDate = new Date();
        const year = todayDate.getFullYear();
        const month = String(todayDate.getMonth() + 1).padStart(2, '0');
        const day = String(todayDate.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        console.log(`Checking reminders for date: ${todayStr}`);

        const result = await db.query(`
      SELECT 
        t.id,
        t.start_date,
        t.payment_status,
        t.last_reminder_sent_at,
        t.monthly_rent,
        t.rent_due_date,
        u.email as user_email,
        tm.tenant_emailid as member_email,
        u.first_name,
        l.first_name AS landlord_first_name,
        l.last_name AS landlord_last_name
      FROM tenants t
      JOIN users u ON u.id = t.user_id
      JOIN properties p ON p.id = t.property_id
      JOIN users l ON l.id = p.landlord_id
      LEFT JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
      WHERE (t.payment_status != 'PAID' OR t.payment_status IS NULL)
    `);

        console.log(`Found ${result.rows.length} active unpaid/unknown tenants.`);

        for (const tenant of result.rows) {
            console.log(`\n--- Tenant ID: ${tenant.id} (${tenant.first_name}) ---`);

            if (!tenant.rent_due_date) {
                console.log("SKIP: No rent_due_date in DB");
                continue;
            }

            const targetEmail = tenant.member_email || tenant.user_email;
            if (!targetEmail) {
                console.log("SKIP: No email found");
                continue;
            }

            let dbDueDate = new Date(tenant.rent_due_date);
            if (isNaN(dbDueDate.getTime())) {
                console.log("SKIP: Invalid rent_due_date format");
                continue;
            }

            console.log(`DB Due Date: ${dbDueDate.toISOString().split('T')[0]}`);

            let targetDueDate = new Date(dbDueDate);
            targetDueDate.setFullYear(todayDate.getFullYear());
            targetDueDate.setMonth(todayDate.getMonth());

            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            while (targetDueDate < minDueDate || targetDueDate <= todayDate) {
                // console.log(`Adjusting target from ${targetDueDate.toISOString().split('T')[0]} to next month...`);
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
            }

            console.log(`Calculated Next Due Date: ${targetDueDate.toISOString().split('T')[0]}`);

            // 5 Days before
            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(reminderDate.getDate() - 5);

            const rYear = reminderDate.getFullYear();
            const rMonth = String(reminderDate.getMonth() + 1).padStart(2, '0');
            const rDay = String(reminderDate.getDate()).padStart(2, '0');
            const reminderDateStr = `${rYear}-${rMonth}-${rDay}`;

            console.log(`Calculated Reminder Date: ${reminderDateStr} (Target match: ${todayStr})`);

            if (todayStr === reminderDateStr) {
                console.log(">>> MATCH! Reminder should be sent today.");

                if (tenant.last_reminder_sent_at) {
                    const lastSentDate = new Date(tenant.last_reminder_sent_at);
                    const lsYear = lastSentDate.getFullYear();
                    const lsMonth = String(lastSentDate.getMonth() + 1).padStart(2, '0');
                    const lsDay = String(lastSentDate.getDate()).padStart(2, '0');
                    const lastSentStr = `${lsYear}-${lsMonth}-${lsDay}`;

                    console.log(`Last reminder sent: ${lastSentStr}`);

                    if (lastSentStr === todayStr) {
                        console.log("SKIP: Already sent today.");
                    } else {
                        console.log("ACTION: Would send email now.");
                    }
                } else {
                    console.log("ACTION: No previous reminder. Would send email now.");
                }

            } else {
                console.log("NO MATCH. Today is not the reminder date.");

                // Diff check
                const rsTime = reminderDate.getTime();
                const todayTime = new Date(todayStr).getTime();
                const diffDays = (todayTime - rsTime) / (1000 * 3600 * 24);
                console.log(`Difference: ${diffDays} days from reminder date.`);
            }
        }

    } catch (err) {
        console.error("❌ DEBUG error:", err);
    } finally {
        // db.end(); // Don't close if pool is shared, but script will hang
        process.exit(0);
    }
};

runDebug();
