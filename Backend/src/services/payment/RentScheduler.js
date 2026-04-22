const cron = require('node-cron');
const db = require('../../config/db');
const sendRentReminderEmail = require('../../utils/email/sendRentReminderEmail');

/**
 * RentScheduler: Automates Rent Warnings and Overdue Alerts
 * - 8:30 AM: Daily Overdue Check (Sends alerts for unpaid balances)
 * - 8:30 PM: Daily Upcoming Warning (0-5 days before due date)
 */
const initRentScheduler = () => {
    console.log('⏰ Rent Scheduler Initialized');

    // ----------------------------------------------------
    // 🔔 9:00 AM: DAILY UPCOMING WARNING (0-3 days remaining)
    // ----------------------------------------------------
    cron.schedule('0 9 * * *', async () => {
        console.log('🔄 Running 9:00 AM Friendly Rent Warning Check...');
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
            today.setHours(12, 0, 0, 0);

            for (const tenant of tenants.rows) {
                const dueDay = parseInt(tenant.rent_due_date);
                if (isNaN(dueDay)) continue;

                let targetDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
                if (targetDueDate < today) {
                    targetDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
                }

                const diffDays = Math.ceil((targetDueDate - today) / (1000 * 60 * 60 * 24));

                // Friendly notice for upcoming rent (0 to 3 days left)
                if (diffDays >= 0 && diffDays <= 3) {
                    console.log(`🔔 [Friendly Warning] Sending to ${tenant.full_name}: Due in ${diffDays} days.`);
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
            console.error('❌ Error in 9:00 AM Friendly Scheduler:', error);
        }
    });
};

module.exports = initRentScheduler;
