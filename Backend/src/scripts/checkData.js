const db = require("../config/db");

const checkData = async () => {
    try {
        console.log("🔍 Checking Admin Dashboard Data...");

        // 1. Check Row Counts
        const userCount = await db.query("SELECT COUNT(*) FROM users");
        console.log("Users Count:", userCount.rows[0]);

        const propCount = await db.query("SELECT COUNT(*) FROM properties");
        console.log("Properties Count:", propCount.rows[0]);

        const payCount = await db.query("SELECT COUNT(*) FROM rent_payments");
        console.log("Payments Count:", payCount.rows[0]);

        const compCount = await db.query("SELECT COUNT(*) FROM complaints");
        console.log("Complaints Count:", compCount.rows[0]);

        // 2. Check Revenue Chart Query
        console.log("\n📊 Checking Revenue Chart Query...");
        const revQuery = `
            SELECT to_char(payment_date,'Mon') as month,
            SUM(amount)::integer as rent,
            0 as service
            FROM rent_payments 
            WHERE payment_date > current_date - interval '6 months'
            GROUP BY to_char(payment_date,'Mon'), EXTRACT(MONTH FROM payment_date) 
            ORDER BY EXTRACT(MONTH FROM payment_date)
        `;
        const revRes = await db.query(revQuery);
        console.log("Revenue Chart Data:", JSON.stringify(revRes.rows, null, 2));

        // 3. Check Complaint Chart Query
        console.log("\n🥧 Checking Complaint Chart Query...");
        const compQuery = `SELECT status as name, COUNT(*)::integer as value FROM complaints GROUP BY status`;
        const compRes = await db.query(compQuery);
        console.log("Complaint Chart Data:", JSON.stringify(compRes.rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("❌ Check Failed:", err);
        process.exit(1);
    }
};

checkData();
