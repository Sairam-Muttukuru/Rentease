
const db = require('../config/db');
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");
require('dotenv').config({ path: 'src/.env' });

async function forceSend() {
    console.log("🚀 Starting FORCE SEND of Rent Reminders...");

    try {
        const todayDate = new Date();
        const year = todayDate.getFullYear();
        const month = String(todayDate.getMonth() + 1).padStart(2, '0');
        const day = String(todayDate.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        console.log(`Checking for date: ${todayStr}`);

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
      WHERE t.payment_status != 'PAID' AND t.status = 'Active'
    `);

        console.log(`Found ${result.rows.length} active unpaid tenants.`);

        for (const tenant of result.rows) {
            const targetEmail = tenant.member_email || tenant.user_email;
            // Debug log
            if (tenant.user_email?.includes('bhavani')) {
                console.log(`Inspecting target tenant: ${targetEmail}`);
            }

            if (!tenant.rent_due_date || !targetEmail) continue;

            let dbDueDate = new Date(tenant.rent_due_date);
            let targetDueDate = new Date(dbDueDate);
            targetDueDate.setFullYear(todayDate.getFullYear());
            targetDueDate.setMonth(todayDate.getMonth());

            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            while (targetDueDate < minDueDate || targetDueDate <= todayDate) {
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
            }

            let cycleStart = new Date(targetDueDate);
            cycleStart.setMonth(cycleStart.getMonth() - 1);

            const reminderDate = new Date(cycleStart);
            reminderDate.setDate(reminderDate.getDate() + 27);

            const rYear = reminderDate.getFullYear();
            const rMonth = String(reminderDate.getMonth() + 1).padStart(2, '0');
            const rDay = String(reminderDate.getDate()).padStart(2, '0');
            const reminderDateStr = `${rYear}-${rMonth}-${rDay}`;

            if (todayStr === reminderDateStr) {
                console.log(`✅ MATCH FOUND for ${targetEmail}! Sending email now...`);

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

                console.log(`📧 SENT to ${targetEmail}`);
            } else {
                if (tenant.user_email?.includes('bhavani')) {
                    console.log(`❌ Mismatch for ${targetEmail}. Expecting Reminder on: ${reminderDateStr}, Today is: ${todayStr}`);
                }
            }
        }
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        console.log("Done.");
        process.exit();
    }
}

forceSend();
