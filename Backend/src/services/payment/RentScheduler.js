const cron = require('node-cron');
const db = require('../../config/db');

const sendRentReminder = require('../../utils/email/sendRentReminderMail'); // Existing overdue reminder
const sendRentWarning = require('../../utils/email/sendRentReminderEmail'); // NEW: Upcoming warning

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
