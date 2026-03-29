const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/email/sendMail");
const { rentReminderTemplate } = require("../utils/email/emailTemplates");

// Schedule: Runs every day at 10:25 AM
cron.schedule("25 10 * * *", async () => {
    console.log("[RentReminderCron] Starting daily rent reminder task at 10:25 AM...");

    try {
        const todayDate = new Date();
        
        // 1. Fetch all tenants with their lease and payment info
        const result = await db.query(`
            SELECT 
                t.id,
                t.start_date,
                t.monthly_rent,
                t.rent_due_date,
                t.last_reminder_sent_at,
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
        `);

        for (const tenant of result.rows) {
            if (!tenant.rent_due_date || !tenant.start_date) continue;

            const targetEmail = tenant.member_email || tenant.user_email;
            if (!targetEmail) continue;

            // 2. Calculate Total Paid
            const paymentRes = await db.query("SELECT SUM(amount) as paid FROM rent_payments WHERE tenant_id = $1", [tenant.id]);
            const totalPaid = parseFloat(paymentRes.rows[0].paid) || 0;

            // 3. Billing Logic: Use Rent Due Date (Anchor Date)
            const anchorRaw = tenant.rent_due_date || tenant.start_date;
            const anchorDate = new Date(anchorRaw);
            anchorDate.setHours(12,0,0,0);
            
            const startDate = new Date(tenant.start_date);
            startDate.setHours(12,0,0,0);

            const today = new Date();
            today.setHours(12,0,0,0);

            if (today < startDate) {
                console.log(`[RentReminderCron] Skipping Tenant ${tenant.id}: Lease starts in future (${tenant.start_date})`);
                continue;
            }

            // Look 3 days into the future
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + 3);

            let monthsDiff = (targetDate.getFullYear() - anchorDate.getFullYear()) * 12 
                           + (targetDate.getMonth() - anchorDate.getMonth());
            if (targetDate.getDate() >= anchorDate.getDate()) {
                monthsDiff += 1;
            }

            let effectiveCycles = Math.max(1, monthsDiff + (startDate < anchorDate ? 1 : 0));

            // 4. Calculate Expected vs Balance based on this 3-day future target
            const totalExpected = effectiveCycles * parseFloat(tenant.monthly_rent);
            const balanceDue = totalExpected - totalPaid;

            if (balanceDue > 0) {
                // Determine display due date (First unpaid cycle)
                let nDue = new Date(anchorDate);
                const getYMD = (d) => {
                    const year = d.getUTCFullYear();
                    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(d.getUTCDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                for (let i = 0; i < 48; i++) {
                    const cycleStart = new Date(anchorDate);
                    cycleStart.setMonth(anchorDate.getMonth() + i);
                    if (cycleStart < startDate) continue;

                    const cycleDateISO = getYMD(cycleStart);
                    const isPaid = (await db.query(
                        "SELECT id FROM rent_payments WHERE tenant_id = $1 AND due_date = $2 AND receipt_number NOT LIKE 'SEC-DEP%'",
                        [tenant.id, cycleDateISO]
                    )).rows.length > 0;
                    
                    if (!isPaid) {
                        nDue = cycleStart;
                        break;
                    }
                }

                const formattedDueDate = nDue.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });

                const landlordName = `${tenant.landlord_first_name} ${tenant.landlord_last_name}`;

                // --- Improved Template (Nicer UI) ---
                const subject = `⚠️ Action Required: Rent Payment of ₹${balanceDue.toLocaleString()} Overdue`;
                const html = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
                            <h2 style="margin: 0;">Rent Payment Reminder</h2>
                        </div>
                        <div style="padding: 30px; line-height: 1.6; color: #333;">
                            <p>Dear <b>${tenant.first_name}</b>,</p>
                            <p>This is a reminder for your rent at <b>RentEase Properties</b> managed by <b>${landlordName}</b>.</p>
                            <div style="background: #fff5f5; border-left: 5px solid #ef4444; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0;"><b>Total Balance Due:</b></p>
                                <h1 style="margin: 10px 0; color: #dc2626;">₹${balanceDue.toLocaleString()}</h1>
                                <p style="margin: 0; font-size: 14px; color: #666;">Cycle Start Date: ${formattedDueDate}</p>
                            </div>
                            <p>Please ensure the payment is made promptly to avoid any late fees.</p>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="http://localhost:5173/login" style="background: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay via Dashboard</a>
                            </div>
                        </div>
                        <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                            Thanks, <br> <b>RentEase Management</b>
                        </div>
                    </div>
                `;

                await sendMail(targetEmail, subject, html);

                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`[RentReminderCron] ✅ Cumulative Reminder sent to ${targetEmail} | Balance: ₹${balanceDue} | Math: ${totalExpected}-${totalPaid}`);
            }
        }
    } catch (err) {
        console.error("❌ Cron error:", err.message);
    }
});
