const fs = require("fs");
const path = require("path");

const initializeDatabase = async (pool) => {
    try {
        console.log("Checking if database needs initialization...");
        const res = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);
        
        const tablesExist = res.rows[0].exists;
        if (tablesExist) {
            console.log("Database already initialized (users table exists). Skipping schema restore.");
            return;
        }

        console.log("Database is empty. Initializing schema and seed data from db_init.sql...");
        const sqlPath = path.join(__dirname, "db_init.sql");
        
        if (!fs.existsSync(sqlPath)) {
            console.error("❌ db_init.sql file not found at:", sqlPath);
            return;
        }

        const sql = fs.readFileSync(sqlPath, "utf8");
        
        // Execute the database restore
        await pool.query(sql);
        console.log("✅ Database schema and seed data restored successfully!");
    } catch (error) {
        console.error("❌ Failed to initialize database:", error);
    }
};

module.exports = initializeDatabase;
