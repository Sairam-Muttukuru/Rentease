const cron = require('node-cron');
const db = require('../../config/db');
const sendRentReminderEmail = require('../../utils/email/sendRentReminderEmail');

/**
 * RentScheduler: Automates Rent Warnings and Overdue Alerts
 * - 9:00 AM: Daily Overdue Check (Sends alerts for unpaid balances)
 * - 8:10 PM: Daily Upcoming Warning (0-5 days before due date)
 */
const initRentScheduler = () => {
    console.log('⏰ Rent Scheduler Initialized: Elite Branding Active');

    // ----------------------------------------------------
    // 1️⃣ 6:30 PM: DAILY OVERDUE CHECK (For unpaid tenants)
    // ----------------------------------------------------
    cron.schedule('30 18 * * *', async () => {
        console.log('🔄 Running 6:30 PM Daily Overdue Check...');
        try {
            const result = await db.query(`
                SELECT 
                    t.id, t.start_date, t.monthly_rent, t.rent_due_date,
                    p.title as property_title,
                    (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY is_cover DESC LIMIT 1) as property_image,
                    tm.tenant_emailid as email, tm.full_name as name
                FROM tenants t
                JOIN properties p ON p.id = t.property_id
                JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
                WHERE t.start_date IS NOT NULL
            `);

            const today = new Date();
            today.setHours(12, 0, 0, 0);

            for (const tenant of result.rows) {
                // Calculate Monthly Arrears
                const paymentsRes = await db.query("SELECT amount FROM rent_payments WHERE tenant_id = $1 AND receipt_number NOT LIKE 'SEC-DEP%'", [tenant.id]);
                const totalPaid = paymentsRes.rows.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

                const startDate = new Date(tenant.start_date);
                if (today < startDate) continue;

                const anchorDate = new Date(tenant.rent_due_date || tenant.start_date);
                let monthsDiff = (today.getFullYear() - anchorDate.getFullYear()) * 12 + (today.getMonth() - anchorDate.getMonth());
                if (today.getDate() >= anchorDate.getDate()) monthsDiff += 1;
                const monthsElapsed = Math.max(1, monthsDiff);

                const rawRent = parseFloat(tenant.monthly_rent);
                const totalExpected = monthsElapsed * rawRent;
                const rawBalance = totalExpected - totalPaid;

                if (rawBalance > 100) { // Balance > 100 to avoid rounding dust
                    const monthsPending = Math.max(1, Math.round(rawBalance / rawRent));
                    
                    console.log(`🚨 [Automated Overdue] Sending to ${tenant.email}: ₹${rawBalance} (${monthsPending} months)`);
                    await sendRentReminderEmail({
                        tenantEmail: tenant.email,
                        tenantName: tenant.name,
                        propertyName: tenant.property_title,
                        dueDate: tenant.rent_due_date,
                        amount: Math.round(rawBalance),
                        daysRemaining: 0,
                        propertyImage: tenant.property_image,
                        monthsPending: monthsPending
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error in 9:00 AM Overdue Scheduler:', error);
        }
    });

    // ----------------------------------------------------
    // 2️⃣ 8:10 PM: DAILY UPCOMING WARNING (0-5 days remaining)
    // ----------------------------------------------------
    cron.schedule('10 20 * * *', async () => {
        console.log('🔄 Running 8:10 PM Rent Warning Check...');
        try {
            const tenants = await db.query(`
                SELECT 
                    t.id, t.monthly_rent, t.rent_due_date,
                    tm.full_name, tm.tenant_emailid as email,
                    p.title as property_name,
                    (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY is_cover DESC LIMIT 1) as property_image
                FROM tenants t
                JOIN properties p ON p.id = t.property_id
                JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
            `);

            const today = new Date();
            const currentDay = today.getDate();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            for (const tenant of tenants.rows) {
                const dueDay = parseInt(tenant.rent_due_date);
                if (isNaN(dueDay)) continue;

                let targetDueDate = new Date(currentYear, currentMonth, dueDay);
                if (targetDueDate < today) {
                    targetDueDate = new Date(currentYear, currentMonth + 1, dueDay);
                }

                const diffDays = Math.ceil((targetDueDate - today) / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays <= 5) {
                    console.log(`🔔 [Automated Warning] Sending to ${tenant.full_name}: Due in ${diffDays} days.`);
                    await sendRentReminderEmail({
                        tenantEmail: tenant.email,
                        tenantName: tenant.full_name,
                        propertyName: tenant.property_name,
                        dueDate: tenant.rent_due_date,
                        amount: tenant.monthly_rent,
                        daysRemaining: diffDays,
                        propertyImage: tenant.property_image,
                        monthsPending: 1
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error in 8:10 PM Scheduler:', error);
        }
    });
};

module.exports = initRentScheduler;
