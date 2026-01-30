const db = require("../config/db");

const migrate = async () => {
    try {
        console.log("🛠️ Starting Schema Migration...");

        // 1. Add 'status' to users
        console.log("Checking 'users' table...");
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';
        `);
        console.log("✅ Added 'status' to users.");

        // 2. Add 'status' to service_providers
        console.log("Checking 'service_providers' table...");
        await db.query(`
            ALTER TABLE service_providers 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';
        `);
        console.log("✅ Added 'status' to service_providers.");

        // 3. Add 'service_area' to service_providers (just in case)
        await db.query(`
            ALTER TABLE service_providers 
            ADD COLUMN IF NOT EXISTS service_area VARCHAR(100);
        `);
        // 4. Add 'company_name' to service_providers (just in case)
        await db.query(`
            ALTER TABLE service_providers 
            ADD COLUMN IF NOT EXISTS company_name VARCHAR(100);
        `);

        // 5. Ensure properties table has all columns
        console.log("Checking 'properties' table...");
        await db.query(`
            ALTER TABLE properties 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Available',
            ADD COLUMN IF NOT EXISTS area INT,
            ADD COLUMN IF NOT EXISTS property_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS city VARCHAR(50),
            ADD COLUMN IF NOT EXISTS locality VARCHAR(50);
        `);


        console.log("🎉 Schema Migration Successful!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Migration Failed:", err);
        process.exit(1);
    }
};

migrate();
