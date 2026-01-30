const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const cors = require("cors");
const PropertyRoutes = require("./routes/PropertyRoutes");
const app = express();
const tenantRoutes = require("./routes/TenantRoutes");
const tenantMemberRoutes = require("./routes/TenantMemberRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
require("./script/RentReminderCron");
const allowedOrigins =
    process.env.NODE_ENV === "production"
        ? [
            "https://rentease.com",
            "https://www.rentease.com"
        ]
        : [
            "http://localhost:5173"
        ];

app.use(cors({
    origin: (origin, callback) => {
        // allow non-browser clients (Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS: Origin not allowed"));
        }
    },
    credentials: true, // 🔐 allow cookies (refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tenant-members", tenantMemberRoutes);
app.use("/api/complaints", require("./routes/ComplaintRoutes"));
app.use("/api/notifications", require("./routes/NotificationRoutes"));
app.use("/api/test", require("./routes/TestMailRoutes"));
app.use("/api/payment", require("./routes/PaymentRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));

module.exports = app;
