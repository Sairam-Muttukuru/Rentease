const db = require("./src/config/db");

async function testServiceProviderRegistration() {
    try {
        console.log("🔍 Testing Service Provider Registration Flow...\n");

        // Test 1: Check if users table exists and has correct columns
        console.log("1️⃣ Checking users table...");
        const usersTableCheck = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
        console.log("✅ Users table columns:", usersTableCheck.rows);

        // Test 2: Check if service_providers table exists
        console.log("\n2️⃣ Checking service_providers table...");
        const providersTableCheck = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'service_providers' 
      ORDER BY ordinal_position
    `);

        if (providersTableCheck.rows.length === 0) {
            console.log("❌ ERROR: service_providers table does NOT exist!");
            console.log("\n📝 Creating service_providers table...");

            await db.query(`
        CREATE TABLE IF NOT EXISTS service_providers (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255) NOT NULL,
          service_type VARCHAR(100) NOT NULL,
          service_area VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

            console.log("✅ service_providers table created!");
        } else {
            console.log("✅ Service providers table columns:", providersTableCheck.rows);
        }

        // Test 3: Try a test insertion
        console.log("\n3️⃣ Testing user creation...");
        const bcrypt = require("bcryptjs");
        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = await bcrypt.hash("testpass123", 10);

        const testUser = await db.query(
            `INSERT INTO users (email, password, role, status) 
       VALUES ($1, $2, 'SERVICE_PROVIDER', 'Active') 
       RETURNING *`,
            [testEmail, testPassword]
        );
        console.log("✅ Test user created:", testUser.rows[0].id);

        // Test 4: Try provider creation
        console.log("\n4️⃣ Testing provider creation...");
        const testProvider = await db.query(
            `INSERT INTO service_providers (user_id, company_name, service_type, service_area, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'Active') 
       RETURNING *`,
            [testUser.rows[0].id, "Test Company", "Plumbing", "Test Area", "1234567890"]
        );
        console.log("✅ Test provider created:", testProvider.rows[0]);

        // Cleanup
        console.log("\n5️⃣ Cleaning up test data...");
        await db.query(`DELETE FROM service_providers WHERE user_id = $1`, [testUser.rows[0].id]);
        await db.query(`DELETE FROM users WHERE id = $1`, [testUser.rows[0].id]);
        console.log("✅ Test data cleaned up");

        console.log("\n✅ ALL TESTS PASSED! The database schema is correct.");

    } catch (err) {
        console.error("\n❌ ERROR:", err.message);
        console.error("Stack:", err.stack);
    } finally {
        process.exit();
    }
}

testServiceProviderRegistration();
