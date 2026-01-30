require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
require("./script/RentReminderCron");

// Log environment status for debugging
console.log("DB_USER:", process.env.DB_USER, typeof process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "********" : "MISSING");
console.log("DB_DATABASE:", process.env.DB_DATABASE, typeof process.env.DB_DATABASE);
console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
