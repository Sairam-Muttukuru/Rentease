const db = require("./src/config/db");

async function checkDatabase() {
    try {
        console.log("🔍 Checking database schema...\n");

        // Check service_providers table
        const result = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'service_providers' 
      ORDER BY ordinal_position
    `);

        if (result.rows.length === 0) {
            console.log("❌ service_providers table does NOT exist!");
            console.log("\n📝 Creating service_providers table...\n");

            await db.query(`
        CREATE TABLE service_providers (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255) NOT NULL,
          service_type VARCHAR(100) NOT NULL,
          service_area VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

            console.log("✅ service_providers table created successfully!");
        } else {
            console.log("✅ service_providers table exists with columns:");
            result.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await db.end();
        process.exit();
    }
}

checkDatabase();
