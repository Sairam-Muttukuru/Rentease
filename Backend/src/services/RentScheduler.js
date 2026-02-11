const cron = require('node-cron');
const db = require('../config/db');
const sendRentReminder = require('../utils/sendRentReminderMail');

// Run every day at 9:00 AM
const initRentScheduler = () => {
    console.log('⏰ Rent Scheduler Initialized: Running daily at 9:00 AM');

    // Schedule: 0 9 * * * (Every day at 9 AM)
    cron.schedule('0 9 * * *', async () => {
        console.log('🔄 Running Daily Rent Check...');
        try {
            // Fetch all active tenants
            const tenants = await db.query(`
        SELECT 
            t.id,
            t.monthly_rent,
            t.start_date,
            t.payment_status,
            tm.full_name,
            tm.tenant_emailid as email,
            p.title as property_name,
            (SELECT COALESCE(SUM(amount), 0) FROM rent_payments WHERE tenant_id = t.id) as total_paid
        FROM tenants t
        JOIN properties p ON p.id = t.property_id
        JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
        WHERE t.start_date IS NOT NULL
      `);

            const currentDate = new Date();

            for (const tenant of tenants.rows) {
                const startDate = new Date(tenant.start_date);
                const monthlyRent = parseFloat(tenant.monthly_rent);

                // ----------------------------------------------------
                // 1. Calculate Expected Months (Standard)
                // ----------------------------------------------------
                // This calculates how many full months satisfy the cycle based on today's date
                let monthsElapsedRaw =
                    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (currentDate.getMonth() - startDate.getMonth()) +
                    (currentDate.getDate() >= startDate.getDate() ? 1 : 0);

                monthsElapsedRaw = Math.max(1, monthsElapsedRaw);

                // ----------------------------------------------------
                // 2. Apply 27-Day Rule
                // ----------------------------------------------------
                // We want to know if the "latest" month (the one just added by monthsElapsedRaw)
                // is actually "due enough" to be charged.
                // The user wants: "only after 27 days of the overdue month then only add the next month rent"

                // Let's find the due date of this "latest" month cycle.
                // If monthsElapsedRaw is 5, it means we entered the 5th month.
                // The due date for the 5th month is: start_date + (5-1) months.
                const latestCycleIndex = monthsElapsedRaw - 1; // 0-indexed
                const latestCycleDueDate = new Date(startDate);
                latestCycleDueDate.setMonth(startDate.getMonth() + latestCycleIndex);

                // Check difference in days between Now and LatestCycleDueDate
                const diffTime = currentDate - latestCycleDueDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let effectiveMonths = monthsElapsedRaw;

                // If less than 27 days have passed since the latest cycle's due date, 
                // we do NOT count this month yet (unless it's the very first month, we usually charge upfront).
                // However, the user said "Next month rent" should only be added after 27 days.
                // Assuming standard rent is due on day 1. 27 days grace is generous, but that's the request.
                if (diffDays < 27 && monthsElapsedRaw > 1) {
                    effectiveMonths = monthsElapsedRaw - 1;
                }

                const expectedRent = effectiveMonths * monthlyRent;
                const totalPaid = parseFloat(tenant.total_paid);
                const outstandingAmount = expectedRent - totalPaid;

                if (outstandingAmount > 0) {
                    // ----------------------------------------------------
                    // 3. Determine Email Type (Friendly vs Overdue)
                    // ----------------------------------------------------
                    // Logic: If the outstanding amount is just for the current recent month (late by < 7 days?), send Friendly.
                    // If it's late by more, send Overdue.

                    // We need to find the due date of the *earliest* unpaid portion to be strict,
                    // or just check the due date of the *current* effective cycle.

                    // Let's look at the effective last due date used for calculation.
                    const distinctUnpaidMonths = Math.ceil(outstandingAmount / monthlyRent);

                    // The "Oldest" unpaid due date would be approx:
                    // effectiveDueDate - (distinctUnpaidMonths - 1) months
                    const effectiveLastDueDate = new Date(startDate);
                    effectiveLastDueDate.setMonth(startDate.getMonth() + (effectiveMonths - 1));

                    // If they owe 1 month, the due date is effectiveLastDueDate.
                    // If they owe 2 months, the oldest due date is 1 month prior to that.
                    const oldestUnpaidDueDate = new Date(effectiveLastDueDate);
                    oldestUnpaidDueDate.setMonth(effectiveLastDueDate.getMonth() - (distinctUnpaidMonths - 1));

                    const daysOverdue = Math.ceil((currentDate - oldestUnpaidDueDate) / (1000 * 60 * 60 * 24));

                    // If older than 5 days, mark as overdue/urgent.
                    const isOverdue = daysOverdue > 5;

                    console.log(`⚠️ Tenant ${tenant.full_name}: Outstanding ₹${outstandingAmount}. Days Overdue: ${daysOverdue}. Sending ${isOverdue ? 'Urgent' : 'Friendly'} mail.`);

                    await sendRentReminder(
                        tenant.email,
                        tenant.full_name,
                        outstandingAmount,
                        effectiveLastDueDate, // Show the latest relevant due date
                        tenant.property_name,
                        isOverdue
                    );
                }
            }
        } catch (error) {
            console.error('❌ Error in Rent Scheduler:', error);
        }
    });
};

module.exports = initRentScheduler;
