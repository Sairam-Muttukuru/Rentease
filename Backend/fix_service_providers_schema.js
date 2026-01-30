const db = require("./src/config/db");

async function fixServiceProvidersTable() {
    try {
        console.log("🔧 Fixing service_providers table schema...\n");

        // Check current user_id type
        const checkType = await db.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'service_providers' AND column_name = 'user_id'
    `);

        console.log("Current user_id type:", checkType.rows[0]?.data_type);

        if (checkType.rows[0]?.data_type === 'integer') {
            console.log("\n❌ user_id is INTEGER but should be UUID!");
            console.log("📝 Fixing the column type...\n");

            // Drop the table and recreate it with correct schema
            await db.query(`DROP TABLE IF EXISTS service_providers CASCADE`);
            console.log("✅ Dropped old service_providers table");

            await db.query(`
        CREATE TABLE service_providers (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255) NOT NULL,
          service_type VARCHAR(100) NOT NULL,
          service_area VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            console.log("✅ Created new service_providers table with UUID user_id");

            // Verify the fix
            const verify = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'service_providers' 
        ORDER BY ordinal_position
      `);

            console.log("\n✅ New table schema:");
            verify.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });

            console.log("\n🎉 Schema fixed successfully!");
        } else {
            console.log("✅ user_id is already UUID - no fix needed!");
        }

    } catch (err) {
        console.error("\n❌ Error:", err.message);
        console.error(err.stack);
    } finally {
        await db.end();
        process.exit();
    }
}

fixServiceProvidersTable();
