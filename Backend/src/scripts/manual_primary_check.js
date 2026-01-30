const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { rentReminderTemplate } = require("../utils/emailTemplates");

const runManualTriggerPrimary = async () => {
    console.log("🔔 Starting Manual Rent Reminder Trigger (Primary Member Check)...");

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
      WHERE t.payment_status != 'PAID'
    `);

        console.log(`Found ${result.rows.length} unpaid tenants.`);

        let sentCount = 0;

        for (const tenant of result.rows) {
            if (!tenant.rent_due_date) {
                console.log(`Skipping Tenant ${tenant.id}: No rent_due_date`);
                continue;
            }

            // Use primary member email if available, otherwise fallback to user email
            const targetEmail = tenant.member_email || tenant.user_email;
            console.log(`[Tenant ${tenant.id}] Primary Member Email: ${tenant.member_email} | User Email: ${tenant.user_email} => Target: ${targetEmail}`);


            if (!targetEmail) {
                console.log(`⚠️ No email found for Tenant ID ${tenant.id}. Skipping.`);
                continue;
            }

            const todayDate = new Date();
            const todayStr = todayDate.toISOString().split("T")[0];

            let targetYear = todayDate.getFullYear();
            let targetMonth = todayDate.getMonth();
            let dueDay = parseInt(tenant.rent_due_date);

            let targetDueDate = new Date(targetYear, targetMonth, dueDay);

            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            // While loop to push to next month if needed
            let loops = 0;
            while ((targetDueDate < minDueDate || targetDueDate < todayDate) && loops < 24) {
                const tStr = targetDueDate.toISOString().split('T')[0];
                if (tStr === todayStr) break;

                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
                loops++;
            }

            const reminderDate = new Date(targetDueDate);
            reminderDate.setDate(targetDueDate.getDate() - 3);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];

            // Using the manual test, I'll bypass the strict DATE check slightly to force a send if it's close, 
            // OR I can just stick to the exact logic. Sticking to exact logic is safer to verify "Production" behavior.
            // But since I *just* sent an email, I might need to bypass the "Last Sent Today" check if I want to re-test.
            // I'll comment out the "Last Sent" check for this manual test only.

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

                console.log(`-> Sending email to ${targetEmail}...`);
                await sendMail(targetEmail, "Rent Payment Reminder", html);

                // Update DB
                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`✅ Reminder sent to ${targetEmail}`);
                sentCount++;
            } else {
                console.log(`-> No email. Date condition not met.`);
            }
        }

        console.log(`\n🎉 Done. Sent ${sentCount} emails.`);
        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
};

runManualTriggerPrimary();
