const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/email/sendMail");

console.log("📅 RentReminderCron: High-End Professional Template Loaded.");

// Schedule: Runs every day at 1:05 PM (Style validation)
cron.schedule("05 13 * * *", async () => {
    console.log("[RentReminderCron] 🔄 Starting professional rent reminder task...");

    try {
        const result = await db.query(`
            SELECT 
                t.id, t.start_date, t.monthly_rent, t.rent_due_date,
                p.id as property_id, p.title as property_title, p.late_penalty_amount,
                (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY is_cover DESC LIMIT 1) as property_image,
                u.email as user_email, tm.tenant_emailid as member_email, u.first_name,
                l.first_name AS landlord_first_name, l.last_name AS landlord_last_name
            FROM tenants t
            JOIN users u ON u.id = t.user_id
            JOIN properties p ON p.id = t.property_id
            JOIN users l ON l.id = p.landlord_id
            LEFT JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
        `);

        const getYMonth = (d) => {
            const date = new Date(new Date(d).getTime() + (5.5 * 60 * 60 * 1000));
            return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
        };

        for (const tenant of result.rows) {
            const targetEmail = tenant.member_email || tenant.user_email;
            if (!targetEmail || !tenant.rent_due_date || !tenant.start_date) continue;

            const paymentsRes = await db.query("SELECT amount, due_date FROM rent_payments WHERE tenant_id = $1 AND receipt_number NOT LIKE 'SEC-DEP%'", [tenant.id]);
            const payments = paymentsRes.rows;
            const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

            const startDate = new Date(tenant.start_date);
            const anchorDate = new Date(tenant.rent_due_date);
            const today = new Date();
            if (today < startDate) continue;

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + 3);

            let monthsDiff = (targetDate.getFullYear() - anchorDate.getFullYear()) * 12 + (targetDate.getMonth() - anchorDate.getMonth());
            if (targetDate.getDate() >= anchorDate.getDate()) monthsDiff += 1;
            const hasInitialMonth = startDate < anchorDate ? 1 : 0;
            const effectiveCycles = Math.max(1, monthsDiff + hasInitialMonth);

            const latePenalty = parseFloat(tenant.late_penalty_amount || 0);
            let lateFees = 0;
            const currentMonthsDiff = (today.getFullYear() - anchorDate.getFullYear()) * 12 + (today.getMonth() - anchorDate.getMonth());
            const cyclesStartedCurrently = Math.max(0, currentMonthsDiff + (startDate < anchorDate ? 1 : 0));

            for (let i = -1; i < cyclesStartedCurrently; i++) {
                const cycleStart = new Date(anchorDate);
                cycleStart.setMonth(anchorDate.getMonth() + i);
                if (cycleStart < startDate) continue;
                if (!payments.some(p => p.due_date && getYMonth(p.due_date) === getYMonth(cycleStart))) {
                    if (today > cycleStart) {
                        const dDiff = Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24));
                        if (dDiff > 0) lateFees += dDiff * latePenalty;
                    }
                }
            }

            const totalExpected = effectiveCycles * parseFloat(tenant.monthly_rent);
            const balanceDue = totalExpected - totalPaid + lateFees;

            if (balanceDue > 0) {
                let firstUnpaidCycleStart = null;
                for (let i = -1; i < effectiveCycles; i++) {
                    const cycle = new Date(anchorDate);
                    cycle.setMonth(anchorDate.getMonth() + i);
                    if (cycle < startDate) continue;
                    if (!payments.some(p => p.due_date && getYMonth(p.due_date) === getYMonth(cycle))) {
                        firstUnpaidCycleStart = cycle;
                        break;
                    }
                }

                if (!firstUnpaidCycleStart) firstUnpaidCycleStart = anchorDate;
                const firstUnpaidCycleEnd = new Date(firstUnpaidCycleStart);
                firstUnpaidCycleEnd.setMonth(firstUnpaidCycleStart.getMonth() + 1);

                const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                const cycleRange = `${formatDate(firstUnpaidCycleStart)} - ${formatDate(firstUnpaidCycleEnd)}`;
                
                const landlordFull = `${tenant.landlord_first_name} ${tenant.landlord_last_name}`;
                const propertyImg = tenant.property_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600";
                
                const subject = `⚠️ Payment Overdue: ₹${balanceDue.toLocaleString()} for ${tenant.property_title}`;
                
                const html = `
                    <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                            
                            <!-- Header Image -->
                            <div style="position: relative; height: 200px; background-image: url('${propertyImg}'); background-size: cover; background-position: center;">
                                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);"></div>
                                <div style="position: absolute; bottom: 20px; left: 24px;">
                                    <span style="background: #ef4444; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Overdue Notice</span>
                                </div>
                            </div>

                            <!-- Content -->
                            <div style="padding: 32px 24px;">
                                <h1 style="color: #0f172a; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Rent Payment Reminder</h1>
                                <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">
                                    Property: <b style="color: #1e293b;">${tenant.property_title}</b><br>
                                    Landlord: <b style="color: #1e293b;">${landlordFull}</b>
                                </p>

                                <div style="margin: 32px 0; padding: 24px; background: #fef2f2; border-radius: 12px; border: 1px solid #fee2e2;">
                                    <div style="display: flex; flex-direction: column; gap: 4px;">
                                        <span style="font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Outstanding Balance</span>
                                        <div style="font-size: 42px; color: #dc2626; font-weight: 900; letter-spacing: -1px;">₹${balanceDue.toLocaleString()}</div>
                                    </div>
                                    
                                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(220, 38, 38, 0.1);">
                                        <div style="font-size: 14px; color: #7f1d1d; display: flex; align-items: center; gap: 8px;">
                                            <span style="font-weight: 700;">UNPAID CYCLE:</span>
                                            <span style="background: rgba(220, 38, 38, 0.08); padding: 4px 10px; border-radius: 6px;">${cycleRange}</span>
                                        </div>
                                        <p style="margin: 12px 0 0 0; font-size: 12px; color: #b91c1c; font-style: italic;">
                                            *Includes your current cycle dues and all accumulated arrears.
                                        </p>
                                        ${lateFees > 0 ? `
                                        <div style="margin-top: 12px; color: #991b1b; font-size: 12px; background: #fee2e2; padding: 6px 12px; border-radius: 6px; display: inline-block; font-weight: 600;">
                                            ⚠️ ACCUMULATED LATE FEES: ₹${lateFees.toLocaleString()}
                                        </div>` : ''}
                                    </div>
                                </div>

                                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
                                    Dear ${tenant.first_name}, this is a kindly reminder to settle your outstanding rent. Please process the payment via your RentEase dashboard to avoid further late penalties or interruptions.
                                </p>

                                <div style="text-align: center;">
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Access Dashboard & Pay</a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                    This is an automated reminder from RentEase Platform.<br>
                                    Having issues? Contact your landlord <b style="color: #64748b;">${landlordFull}</b> directly.
                                </p>
                            </div>
                        </div>
                    </div>
                `;

                await sendMail(targetEmail, subject, html);
                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
                console.log(`[RentReminderCron] ✅ Professional reminder sent to ${targetEmail}`);
            }
        }
    } catch (err) {
        console.error("❌ RentReminderCron Error:", err);
    }
});
