const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/email/sendMail");

console.log("📅 RentReminderCron: High-End Professional Template Loaded.");

// Schedule: Runs every day at 8:30 PM (Style validation)
cron.schedule("30 20 * * *", async () => {
    console.log("[RentReminderCron] 🔄 Starting professional rent reminder task...");

    try {
        const result = await db.query(`
            SELECT 
                t.id, t.start_date, t.monthly_rent, t.rent_due_date,
                p.id as property_id, p.title as property_title, p.late_penalty_amount, p.property_type, p.room_type,
                (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY is_cover DESC LIMIT 1) as property_image,
                u.email as user_email, u.first_name,
                l.first_name AS landlord_first_name, l.last_name AS landlord_last_name,
                COALESCE(
                    (SELECT json_agg(json_build_object('email', tm.tenant_emailid, 'name', tm.full_name))
                     FROM tenant_members tm 
                     WHERE tm.tenant_id = t.id AND tm.tenant_emailid IS NOT NULL),
                    '[]'
                ) as all_occupants
            FROM tenants t
            LEFT JOIN users u ON u.id = t.user_id
            JOIN properties p ON p.id = t.property_id
            JOIN users l ON l.id = p.landlord_id
        `);

        const getYMonth = (d) => {
            const date = new Date(new Date(d).getTime() + (5.5 * 60 * 60 * 1000));
            return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
        };

        for (const tenant of result.rows) {
            const occupants = tenant.all_occupants || [];
            if (occupants.length === 0 && !tenant.user_email) continue;
            if (!tenant.rent_due_date || !tenant.start_date) continue;

            const isPG = tenant.property_type?.toUpperCase().includes('PG') || tenant.property_type?.toUpperCase().includes('HOSTEL');
            const isBachelor = tenant.room_type?.toUpperCase().includes('BACHELOR') || tenant.tenant_type === 'BACHELORS';

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

            const rawRent = parseFloat(tenant.monthly_rent);
            const totalExpected = effectiveCycles * rawRent;
            const rawBalance = totalExpected - totalPaid + lateFees;

            if (rawBalance > 0) {
                // Determine display rent and split
                let displayBalance = rawBalance;
                let isSplit = false;

                if (isBachelor && !isPG && occupants.length > 1) {
                    displayBalance = rawBalance / occupants.length;
                    isSplit = true;
                }

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

                const subject = `⚠️ Payment Overdue: ₹${displayBalance.toLocaleString()} for ${tenant.property_title}`;

                // Recipients: If Bachelors/PG, all. Else, just primary.
                const recipients = (isBachelor || isPG) ? occupants : occupants.filter(oc => oc.email === tenant.user_email);
                if (recipients.length === 0 && tenant.user_email) recipients.push({ email: tenant.user_email, name: tenant.first_name });

                for (const recipient of recipients) {
                    const html = `
                        <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                                
                                <div style="position: relative; height: 200px;">
                                    <img src="${propertyImg}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;" />
                                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);"></div>
                                    <div style="position: absolute; bottom: 20px; left: 24px;">
                                        <span style="background: #ef4444; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Overdue Notice</span>
                                    </div>
                                </div>

                                <div style="padding: 32px 24px;">
                                    <h1 style="color: #0f172a; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Rent Payment Reminder</h1>
                                    <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">
                                        Property: <b style="color: #1e293b;">${tenant.property_title}</b><br>
                                        Landlord: <b style="color: #1e293b;">${landlordFull}</b>
                                    </p>

                                    <div style="margin: 32px 0; padding: 24px; background: #fef2f2; border-radius: 12px; border: 1px solid #fee2e2;">
                                        <div style="display: flex; flex-direction: column; gap: 4px;">
                                            <span style="font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                ${isSplit ? 'Your Split Share' : (isPG ? 'Your Individual Rent' : 'Outstanding Balance')}
                                            </span>
                                            <div style="font-size: 42px; color: #dc2626; font-weight: 900; letter-spacing: -1px;">₹${displayBalance.toLocaleString()}</div>
                                        </div>
                                        
                                        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(220, 38, 38, 0.1);">
                                            <div style="font-size: 14px; color: #7f1d1d; display: flex; align-items: center; gap: 8px;">
                                                <span style="font-weight: 700;">CYCLE:</span>
                                                <span style="background: rgba(220, 38, 38, 0.08); padding: 4px 10px; border-radius: 6px;">${cycleRange}</span>
                                            </div>
                                            ${isSplit ? `<p style="margin: 12px 0 0 0; font-size: 12px; color: #b91c1c;">*Total unit rent split equally across ${occupants.length} tenants.</p>` : ''}
                                        </div>
                                    </div>

                                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
                                        Dear ${recipient.name || 'Resident'}, this is a reminder to settle your rent. Please process the payment via your RentEase dashboard to avoid any issues.
                                    </p>

                                    <div style="text-align: center;">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Access Dashboard & Pay</a>
                                    </div>
                                </div>

                                <div style="background: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                        Automated reminder from RentEase Platform.<br>
                                        Contact your landlord <b style="color: #64748b;">${landlordFull}</b> for any queries.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;

                    await sendMail(recipient.email, subject, html);
                    console.log(`[RentReminderCron] ✅ REMINDER SENT | User: ${recipient.name || 'Resident'} | Email: ${recipient.email} | Amount: ₹${displayBalance.toLocaleString()} | Type: ${isSplit ? 'Split Share' : (isPG ? 'Individual PG' : 'Standard')}`);
                }

                await db.query("UPDATE tenants SET last_reminder_sent_at = NOW() WHERE id = $1", [tenant.id]);
            }
        }
    } catch (err) {
        console.error("❌ RentReminderCron Error:", err);
    }
});
