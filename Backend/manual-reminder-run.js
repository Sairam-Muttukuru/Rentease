const cron = require("node-cron");
const db = require("./src/config/db");
const sendMail = require("./src/utils/email/sendMail");
const path = require('path');
require('dotenv').config();

const sendRentReminderEmail = require("./src/utils/email/sendRentReminderEmail");

async function forceRunReminders() {
    console.log("🚀 [Diagnostic] Forcing manual rent reminder run...");
    console.log("📅 Current Local Time:", new Date().toLocaleString());

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

        console.log(`📊 Found ${result.rows.length} active tenant records to check.`);

        const getYMonth = (d) => {
            const date = new Date(new Date(d).getTime() + (5.5 * 60 * 60 * 1000));
            return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
        };

        for (const tenant of result.rows) {
            console.log(`--- Checking Tenant ID ${tenant.id} (${tenant.property_title}) ---`);
            
            const occupants = tenant.all_occupants || [];
            if (occupants.length === 0 && !tenant.user_email) {
                console.log(`⚠️ Skip: No email found.`);
                continue;
            }
            if (!tenant.rent_due_date || !tenant.start_date) {
                console.log(`⚠️ Skip: Missing dates.`);
                continue;
            }

            const isPG = tenant.property_type?.toUpperCase().includes('PG') || tenant.property_type?.toUpperCase().includes('HOSTEL');
            const isBachelor = tenant.room_type?.toUpperCase().includes('BACHELOR');

            const paymentsRes = await db.query("SELECT amount, due_date FROM rent_payments WHERE tenant_id = $1 AND receipt_number NOT LIKE 'SEC-DEP%'", [tenant.id]);
            const payments = paymentsRes.rows;
            const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

            const startDate = new Date(tenant.start_date);
            const anchorDateRaw = new Date(tenant.rent_due_date || tenant.start_date);
            const anchorDate = new Date(Date.UTC(anchorDateRaw.getUTCFullYear(), anchorDateRaw.getUTCMonth(), anchorDateRaw.getUTCDate(), 12, 0, 0, 0));
            const today = new Date();
            today.setHours(12, 0, 0, 0);
            
            if (today < startDate) {
                console.log(`⏭️ Future Tenant: starts on ${tenant.start_date}`);
                continue;
            }

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + 3);

            let monthsDiff = (targetDate.getFullYear() - anchorDate.getFullYear()) * 12 + (targetDate.getMonth() - anchorDate.getMonth());
            if (targetDate.getDate() >= anchorDate.getDate()) monthsDiff += 1;
            const hasInitialMonth = startDate < anchorDate ? 1 : 0;
            const monthsElapsed = Math.max(1, monthsDiff + hasInitialMonth);

            const rawRent = parseFloat(tenant.monthly_rent);
            const totalExpected = monthsElapsed * rawRent;
            const rawBalance = totalExpected - totalPaid;

            console.log(`💰 Expected Cycles: ${monthsElapsed} | Expected Total: ${totalExpected} | Paid: ${totalPaid} | Balance: ${rawBalance}`);

            if (rawBalance > 1) {
                let displayBalance = rawBalance;
                let isSplit = false;
                
                if (isBachelor && !isPG && occupants.length > 1) {
                    displayBalance = rawBalance / occupants.length;
                    isSplit = true;
                }

                const propertyImg = tenant.property_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600";
                const subject = `⚠️ Payment Reminder: ₹${Math.round(displayBalance).toLocaleString()} for ${tenant.property_title}`;
                
                const recipients = (isBachelor || isPG) ? occupants : occupants.filter(oc => oc.email === tenant.user_email);
                if (recipients.length === 0 && tenant.user_email) recipients.push({ email: tenant.user_email, name: tenant.first_name });

                const monthsPending = Math.max(1, Math.round(rawBalance / rawRent));
                
                for (const recipient of recipients) {
                    console.log(`📧 SENDING TO: ${recipient.email} (Name: ${recipient.name}) | Amount: ₹${Math.round(displayBalance)} | Months: ${monthsPending}`);
                    
                    await sendRentReminderEmail({
                        tenantEmail: recipient.email,
                        tenantName: recipient.name || 'Resident',
                        propertyName: tenant.property_title,
                        dueDate: tenant.rent_due_date,
                        amount: Math.round(displayBalance),
                        daysRemaining: 0,
                        propertyImage: tenant.property_image,
                        monthsPending: monthsPending
                    });
                }
                console.log(`✅ DISPATCHED: Premium Reminders for Tenant ID ${tenant.id}`);
            } else {
                console.log(`👌 UP-TO-DATE: Tenant ID ${tenant.id} has no balance.`);
            }
        }
        console.log("\n🏁 FORCE-RUN COMPLETE.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Diagnostic Error:", err);
        process.exit(1);
    }
}

forceRunReminders();
