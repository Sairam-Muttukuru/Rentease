const db = require("./src/config/db");
const bcrypt = require("bcryptjs");

async function create() {
    try {
        const email = "test_sp@example.com";
        const password = "Password123!";
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create user
        const userRes = await db.query(
            "INSERT INTO users (first_name, last_name, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            ["Test", "SP", email, hashedPassword, "SERVICE_PROVIDER", "Active"]
        );
        const userId = userRes.rows[0].id;

        // 2. Create profile
        await db.query(
            "INSERT INTO service_providers (user_id, company_name, status, service_type) VALUES ($1, $2, $3, $4)",
            [userId, "Test Company", "Active", "Maintenance"]
        );

        console.log("TEST USER CREATED with ID:", userId);
    } catch (e) {
        console.error("CREATE FAILED:", e);
    } finally {
        process.exit();
    }
}

create();
