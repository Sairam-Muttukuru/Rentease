const db = require("./src/config/db");

async function checkUsersTable() {
    try {
        console.log("🔍 Checking users table schema...\n");

        const result = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

        console.log("✅ Users table columns:");
        result.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

        // Now create service_providers table with matching type
        const userIdType = result.rows.find(col => col.column_name === 'id')?.data_type;
        console.log(`\n📝 users.id type is: ${userIdType}`);
        console.log(`\n🔧 Creating service_providers table with matching ${userIdType} type...\n`);

        await db.query(`DROP TABLE IF EXISTS service_providers CASCADE`);

        await db.query(`
      CREATE TABLE service_providers (
        id SERIAL PRIMARY KEY,
        user_id ${userIdType} NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        service_area VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log("✅ service_providers table created successfully!");

        // Verify
        const verify = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'service_providers' 
      ORDER BY ordinal_position
    `);

        console.log("\n✅ service_providers table columns:");
        verify.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });

    } catch (err) {
        console.error("\n❌ Error:", err.message);
    } finally {
        await db.end();
        process.exit();
    }
}

checkUsersTable();
