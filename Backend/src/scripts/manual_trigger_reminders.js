const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");

const runManualTrigger = async () => {
    console.log("🔔 Starting Manual Rent Reminder Trigger...");

    try {
        const today = new Date().toISOString().split("T")[0];

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

        console.log(`Found ${result.rows.length} unpaid tenants.`);

        let sentCount = 0;

        for (const tenant of result.rows) {
            if (!tenant.rent_due_date) {
                console.log(`Skipping Tenant ${tenant.id}: No rent_due_date`);
                continue;
            }

            const todayDate = new Date();
            const todayStr = todayDate.toISOString().split("T")[0];

            // 1. Construct target due date for current month
            let targetYear = todayDate.getFullYear();
            let targetMonth = todayDate.getMonth();
            let dueDay = parseInt(tenant.rent_due_date);

            let targetDueDate = new Date(targetYear, targetMonth, dueDay);

            // 2. Enforce 30-day buffer from Start Date
            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            // If target date is invalid (too early) or already passed, move to next month
            // Note: In manual trigger, we might want to be more lenient, but keeping logic usually matches cron.
            // BUT: limit the loop to avoid infinite loops if data is weird.
            let loops = 0;
            while ((targetDueDate < minDueDate || targetDueDate < todayDate) && loops < 24) {
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
                loops++;
            }

            // 3. Calculate Reminder Date (3 days before = 27 days after start)
            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(targetDueDate.getDate() - 3);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];

            console.log(`Tenant ${tenant.first_name} (ID: ${tenant.id}): Start=${tenant.start_date.toISOString().split('T')[0]}, TargetDue=${targetDueDate.toISOString().split('T')[0]}, Reminder=${reminderDateStr}`);

            // 4. Check if today is within the reminder window
            if (todayStr >= reminderDateStr && todayStr <= targetDueDate.toISOString().split("T")[0]) {

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

                console.log(`-> Sending email to ${tenant.email}...`);
                await sendMail(tenant.email, "Rent Payment Reminder", html);

                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`✅ Reminder sent to ${tenant.email}`);
                sentCount++;
            } else {
                console.log(`-> No email. Today (${todayStr}) is not between ${reminderDateStr} and ${targetDueDate.toISOString().split("T")[0]}`);
            }
        }

        console.log(`\n🎉 Done. Sent ${sentCount} emails.`);
        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
};

runManualTrigger();
