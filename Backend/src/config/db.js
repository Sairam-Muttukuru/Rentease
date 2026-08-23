
require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
});

const { Pool } = require("pg");

let poolConfig = {};

if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    const isLocal = process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
    };
} else {
    poolConfig = {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_DATABASE || "RentEase",
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432", 10)
    };
}

const pool = new Pool(poolConfig);

const initializeDatabase = require("./initDb");

pool.connect(async (err, client, release) => {
    if (err) {
        console.error("❌ Database Connection Error:", err.message || err);
        console.error("💡 If you are using Supabase, ensure your DATABASE_URL in Backend/src/.env is in one of these formats:");
        console.error("   - Direct: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres");
        console.error("   - Pooler: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres");
        console.error("💡 If you want to use local PostgreSQL, comment out DATABASE_URL in Backend/src/.env.");
        return;
    }

    const hostDisplay = poolConfig.connectionString 
        ? poolConfig.connectionString.replace(/:[^:@]+@/, ":****@")
        : `${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`;

    console.log(`✅ Connected to Database successfully! [${hostDisplay}]`);

    release();

    try {
        await initializeDatabase(pool);
    } catch (initErr) {
        console.error("Database initialization notice:", initErr.message);
    }
});

module.exports = pool;