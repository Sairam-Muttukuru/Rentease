const express = require("express");
const router = express.Router();
const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");

router.post("/send-test-mail", async (req, res) => {
    try {
        console.log("sendMail type:", typeof sendMail);

        const html = rentReminderTemplate(
            "Test Tenant",
            10000,
            "22 Feb 2026"
        );

        await sendMail(
            req.body.email,
            "Test Rent Reminder",
            html
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.post("/trigger-reminders", async (req, res) => {
    console.log("🔔 Manual Trigger: Rent Reminder Cron Logic");
    let sentCount = 0;

    try {
        const todayDate = new Date();
        const todayStr = todayDate.toISOString().split("T")[0];

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

        for (const tenant of result.rows) {
            if (!tenant.rent_due_date) continue;

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
            while (targetDueDate < minDueDate || targetDueDate < todayDate) {
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
            }

            // 3. Calculate Reminder Date (3 days before = 27 days after start)
            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(targetDueDate.getDate() - 3);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];

            console.log(`Checking Tenant: ${tenant.first_name} | Due: ${targetDueDate.toDateString()} | Remind On: ${reminderDateStr} | Today: ${todayStr}`);

            // 4. Check if today is within the reminder window (force check for manual trigger if needed, but sticking to logic)
            // To allow testing "right now" even if dates don't align, user might need to adjust their start_date in DB. 
            // BUT, if they just want to see IF it works, I can bypass the date check with a query param? 
            // Let's stick to strict logic first so they know if their data is set up right.

            if (todayStr >= reminderDateStr && todayStr <= targetDueDate.toISOString().split("T")[0]) {

                // Check if already sent today
                if (tenant.last_reminder_sent_at) {
                    const lastSent = new Date(tenant.last_reminder_sent_at).toISOString().split("T")[0];
                    if (lastSent === todayStr) {
                        console.log("Skipping: Already sent today");
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

                await sendMail(tenant.email, "Rent Payment Reminder", html);

                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`📧 Reminder sent to ${tenant.email}`);
                sentCount++;
            }
        }

        res.json({ success: true, message: `Logic ran. Sent ${sentCount} emails.` });

    } catch (err) {
        console.error("❌ Manual Trigger Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
