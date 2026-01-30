
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function verifyReminders() {
    console.log("🔍 Checking for reminders that should be sent TODAY (Jan 28)...");

    try {
        const res = await db.query(`
      SELECT t.id, t.start_date, t.monthly_rent, u.email, u.first_name, t.rent_due_date
      FROM tenants t
      JOIN users u ON u.id = t.user_id
    `);

        const tenants = res.rows;
        const todayStr = new Date().toISOString().split("T")[0]; // Should be 2026-01-28
        let count = 0;

        console.log(`Checking ${tenants.length} tenants against Today: ${todayStr}`);

        for (const tenant of tenants) {
            if (!tenant.rent_due_date) continue;

            let dbDueDate = new Date(tenant.rent_due_date);
            if (isNaN(dbDueDate.getTime())) continue;

            // Project to current month
            let targetDueDate = new Date(dbDueDate);
            const todayDate = new Date();
            targetDueDate.setFullYear(todayDate.getFullYear());
            targetDueDate.setMonth(todayDate.getMonth());

            // Enforce 30-day buffer
            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            while (targetDueDate < minDueDate || targetDueDate <= todayDate) {
                targetDueDate.setMonth(targetDueDate.getMonth() + 1);
            }

            // Calculate Reminder Date (Cycle Start + 27 days)
            let cycleStart = new Date(targetDueDate);
            cycleStart.setMonth(cycleStart.getMonth() - 1);

            const reminderDate = new Date(cycleStart);
            reminderDate.setDate(reminderDate.getDate() + 27);
            const reminderDateStr = reminderDate.toISOString().split("T")[0];

            if (todayStr === reminderDateStr) {
                console.log(`✅ MATCH: Email would be sent to ${tenant.email}`);
                console.log(`   - Start Date: ${tenant.start_date}`);
                console.log(`   - Cycle Start: ${cycleStart.toDateString()}`);
                console.log(`   - 27th Day (Reminder): ${reminderDateStr}`);
                console.log(`   - Next Due Date: ${targetDueDate.toDateString()}`);
                count++;
            } else {
                console.log(`❌ No match for ${tenant.email}`);
                console.log(`   - Computed Reminder: ${reminderDateStr}`);
                console.log(`   - Today: ${todayStr}`);
            }
        }

        if (count === 0) console.log("⚠️ No reminders matched for today.");

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

verifyReminders();
