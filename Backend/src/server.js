require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
const initRentScheduler = require("./services/RentScheduler");

// Log environment status for debugging
console.log("DB_USER:", process.env.DB_USER, typeof process.env.DB_USER);
console.log("DB_DATABASE:", process.env.DB_DATABASE, typeof process.env.DB_DATABASE);

app.listen(5000, () => {
    console.log("Server running on port 5000");
    // Start Cron Jobs
    initRentScheduler();
});
