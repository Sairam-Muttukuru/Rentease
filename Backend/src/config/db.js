
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

const isProduction = process.env.DATABASE_URL;

const pool = new Pool(
    isProduction
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false
              }
          }
        : {
              user: process.env.DB_USER,
              host: process.env.DB_HOST,
              database: process.env.DB_DATABASE,
              password: process.env.DB_PASSWORD,
              port: process.env.DB_PORT
          }
);

module.exports = pool;