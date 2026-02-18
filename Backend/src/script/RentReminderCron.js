const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/email/sendMail");
const { rentReminderTemplate } = require("../utils/email/emailTemplates");

// Runs every day at 3:15 PM
cron.schedule("25 15 * * *", async () => {
    console.log("🔔 Rent Reminder Cron Started (Local Check)");

    try {
        // Use Local Date String for comparison (YYYY-MM-DD)
        // This ensures Jan 28 14:30 matches Jan 28 00:00
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

        for (const tenant of result.rows) {
            if (!tenant.rent_due_date) continue;

            const targetEmail = tenant.member_email || tenant.user_email;
            if (!targetEmail) continue;

            // 1. Parse DB Due Date
            let dbDueDate = new Date(tenant.rent_due_date);
            if (isNaN(dbDueDate.getTime())) continue;

            // 2. Project to current/future month
            // We want to find the NEXT due date relative to today
            let targetDueDate = new Date(dbDueDate);
            targetDueDate.setFullYear(todayDate.getFullYear());
            targetDueDate.setMonth(todayDate.getMonth());

            // 2b. Start Date buffer check
            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            // While target < minBuffer OR target <= today
            // We move to next month if the due date is in the past
            // e.g. if today is Jan 28, and Target is Jan 1 -> Move to Feb 1
            while (targetDueDate < minDueDate || targetDueDate <= todayDate) {
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
            }

            // 3. Calculate Reminder Date (Due Date - 5 days)
            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(reminderDate.getDate() - 5);

            // Format Reminder Date to Local String YYYY-MM-DD
            const rYear = reminderDate.getFullYear();
            const rMonth = String(reminderDate.getMonth() + 1).padStart(2, '0');
            const rDay = String(reminderDate.getDate()).padStart(2, '0');
            const reminderDateStr = `${rYear}-${rMonth}-${rDay}`;

            // 4. Check if today is within the reminder window (ReminderDate to DueDate)
            const reminderTime = reminderDate.getTime();
            const todayTime = new Date(todayStr).getTime();
            const dueTime = targetDueDate.getTime();

            // We send if Today is >= Reminder Date AND Today <= Due Date
            if (todayTime >= reminderTime && todayTime <= dueTime) {

                // Check if we already sent a reminder *after* the calculated ReminderDate (i.e., in this cycle)
                if (tenant.last_reminder_sent_at) {
                    const lastSent = new Date(tenant.last_reminder_sent_at);
                    lastSent.setHours(0, 0, 0, 0); // Normalize to midnight

                    if (lastSent.getTime() >= reminderTime) {
                        console.log(`Reminder already sent to ${targetEmail} for this cycle.`);
                        continue;
                    }
                }

                const formattedDueDate = targetDueDate.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });

                const landlordName = `${tenant.landlord_first_name} ${tenant.landlord_last_name}`;

                const html = rentReminderTemplate(
                    tenant.first_name,
                    tenant.monthly_rent,
                    formattedDueDate,
                    landlordName
                );

                await sendMail(targetEmail, "Rent Payment Reminder", html);

                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`📧 Reminder sent to ${targetEmail} for due date ${formattedDueDate}`);
            }
        }
    } catch (err) {
        console.error("❌ Cron error:", err.message);
    }
});
