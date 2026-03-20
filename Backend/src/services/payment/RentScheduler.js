const cron = require('node-cron');
const db = require('../../config/db');

const sendRentReminder = require('../../utils/email/sendRentReminderMail'); // Existing overdue reminder
const sendRentWarning = require('../../utils/email/sendRentReminderEmail'); // NEW: Upcoming warning

// Run every day at 9:00 AM
const initRentScheduler = () => {
    console.log('⏰ Rent Scheduler Initialized: Running daily at 9:00 AM');

    /* 
    // OLD 9:00 AM Cron - Disabled in favor of 10:25 AM Consistently Scheduled Reminder
    cron.schedule('0 9 * * *', async () => {
        console.log('🔄 Running Daily Rent Check...');
        try {
            // ... [Old Logic Removed] ...
        } catch (error) {
            console.error('❌ Error in Rent Scheduler:', error);
        }
    });
    */


    // ----------------------------------------------------
    // New Schedule: 8:10 PM Daily (20:10)
    // ----------------------------------------------------
    cron.schedule('10 20 * * *', async () => {
        console.log('🔄 Running 8:10 PM Rent Warning Check...');
        try {
            // Fetch all active tenants
            const tenants = await db.query(`
                SELECT 
                    t.id,
                    t.monthly_rent,
                    t.start_date,
                    t.rent_due_date, -- Day of month (e.g., 5, 20)
                    tm.full_name,
                    tm.tenant_emailid as email,
                    p.title as property_name
                FROM tenants t
                JOIN properties p ON p.id = t.property_id
                JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
                WHERE t.start_date IS NOT NULL AND t.rent_due_date IS NOT NULL
            `);

            const today = new Date();
            const currentDay = today.getDate();
            const currentMonth = today.getMonth(); // 0-indexed
            const currentYear = today.getFullYear();

            for (const tenant of tenants.rows) {
                const dueDay = parseInt(tenant.rent_due_date);
                if (isNaN(dueDay)) continue;

                // Construct the "Target Due Date" for THIS month
                let targetDueDate = new Date(currentYear, currentMonth, dueDay);

                // Handle edge case: If today is late in the month (e.g., 28th) and due date is early (e.g., 2nd),
                // we might be looking at NEXT month's due date.
                // But usually, reminders are for the upcoming date.

                // If the due date for this month has passed, look at next month?
                // The requirement is "5 days before".
                // If today is 25th, and due date is 30th (diff 5) -> Send.
                // If today is 25th, and due date is 2nd (next month) -> (Diff approx 7 days)

                // Let's create a robust "Next Due Date" finder
                if (targetDueDate < today) {
                    // This month's date passed. Check next month.
                    targetDueDate = new Date(currentYear, currentMonth + 1, dueDay);
                }

                // Calculate difference in days
                const diffTime = targetDueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // User Request: "before the 5 days of the rent due date"
                // Assuming this means [5, 4, 3, 2, 1, 0] days remaining.
                if (diffDays >= 0 && diffDays <= 5) {
                    console.log(`🔔 Sending 8:10 PM Reminder to ${tenant.full_name}: Due in ${diffDays} days.`);
                    await sendRentWarning({
                        tenantEmail: tenant.email,
                        tenantName: tenant.full_name,
                        propertyName: tenant.property_name,
                        dueDate: tenant.rent_due_date,
                        amount: tenant.monthly_rent,
                        daysRemaining: diffDays
                    });
                }
            }

        } catch (error) {
            console.error('❌ Error in 8:10 PM Scheduler:', error);
        }
    });
};

module.exports = initRentScheduler;
