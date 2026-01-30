const db = require("../config/db");
const bcrypt = require("bcryptjs");

const providers = [
    {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@plumbing.com",
        company_name: "RapidFix Plumbing",
        service_type: "Plumbing",
        service_area: "Downtown",
        phone: "+1 555-0101"
    },
    {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@electric.com",
        company_name: "Sparky Services",
        service_type: "Electrical",
        service_area: "Westside",
        phone: "+1 555-0102"
    },
    {
        first_name: "Mike",
        last_name: "Johnson",
        email: "mike.j@clean.com",
        company_name: "Spotless Cleaners",
        service_type: "Cleaning",
        service_area: "North Hills",
        phone: "+1 555-0103"
    }
];

async function seedProviders() {
    console.log("🌱 Seeding Service Providers...");

    try {
        const passwordHash = await bcrypt.hash("password123", 10);

        for (const p of providers) {
            // 1. Check if user exists
            const userRes = await db.query("SELECT * FROM users WHERE email = $1", [p.email]);

            let userId;
            if (userRes.rows.length > 0) {
                userId = userRes.rows[0].id;
                console.log(`User ${p.email} already exists.`);
            } else {
                // 2. Create User
                const newUser = await db.query(
                    `INSERT INTO users (first_name, last_name, email, password, role, status) 
           VALUES ($1, $2, $3, $4, 'SERVICE_PROVIDER', 'Active') RETURNING id`,
                    [p.first_name, p.last_name, p.email, passwordHash]
                );
                userId = newUser.rows[0].id;
                console.log(`Created user for ${p.email}`);
            }

            // 3. Check if provider exists
            const providerRes = await db.query("SELECT * FROM service_providers WHERE user_id = $1", [userId]);
            if (providerRes.rows.length === 0) {
                // 4. Create Provider
                await db.query(
                    `INSERT INTO service_providers (user_id, company_name, service_type, service_area, phone, status)
           VALUES ($1, $2, $3, $4, $5, 'Active')`,
                    [userId, p.company_name, p.service_type, p.service_area, p.phone]
                );
                console.log(`✅ Added provider: ${p.company_name}`);
            } else {
                console.log(`Provider profile for ${p.company_name} already exists.`);
            }
        }
        console.log("🎉 Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seedProviders();
