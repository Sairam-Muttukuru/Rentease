
// require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
// const { Pool } = require("pg");

// console.log("DB Config:", {
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     passwordType: typeof process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

// module.exports = pool;
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { Pool } = require("pg");

// Check if running in production (Render or NODE_ENV)
const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

if (isProduction) {
    const dbUrl = process.env.DATABASE_URL || "";
    // Clean and parse URL (masking password)
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@");
    console.log("Connecting to Production Database URL:", maskedUrl);
} else {
    console.log(`Connecting to Development Database: Host=${process.env.DB_HOST}, DB=${process.env.DB_DATABASE}`);
}

const pool = new Pool(
    isProduction
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        }
);


const initializeDatabase = require("./initDb");

// Test the database connection
pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('Database Connection Error:', err.stack);
    }
    console.log('✅ Connected to the PostgreSQL database successfully!');
    release();

    // Auto initialize tables/seed data if database is empty
    await initializeDatabase(pool);

    // Reset password for sairammuttukuru.cse@gmail.com to '12345678'
    try {
        await pool.query(
            "UPDATE users SET password = $1 WHERE LOWER(email) = LOWER($2)",
            ["$2b$10$OSReT4clHGQxnlDGM05inuElTpT2UWeLc47PQ8NUbMimQ.Zv4jCfy", "sairammuttukuru.cse@gmail.com"]
        );
        console.log("🛠️ Diagnostic: Successfully reset password for sairammuttukuru.cse@gmail.com to '12345678'!");
    } catch (dbErr) {
        console.error("🛠️ Diagnostic: Failed to reset password:", dbErr);
    }
});

module.exports = pool;