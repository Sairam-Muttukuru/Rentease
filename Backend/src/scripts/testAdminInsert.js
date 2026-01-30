const db = require("../config/db");

const testAdminInsert = async () => {
    try {
        console.log("🧪 Testing Admin Insert...");
        await db.query(`
            INSERT INTO users (email, password, role, first_name, last_name, status) 
            VALUES ('testadmin@check.com', 'pass', 'ADMIN', 'Test', 'Admin', 'Active')
        `);
        console.log("✅ Admin Insert Supported!");

        // Cleanup
        await db.query("DELETE FROM users WHERE email='testadmin@check.com'");
        process.exit(0);
    } catch (err) {
        console.error("❌ Admin Insert Failed:", err.message);
        process.exit(1);
    }
};

testAdminInsert();
