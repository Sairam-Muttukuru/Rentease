
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


// Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Database Connection Error:', err.stack);
    }
    console.log('✅ Connected to the PostgreSQL database successfully!');
    release();
});

module.exports = pool;