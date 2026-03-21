const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth/AuthRoutes");
const cors = require("cors");
const PropertyRoutes = require("./routes/landlord/PropertyRoutes");
const app = express();
const tenantRoutes = require("./routes/tenant/TenantRoutes");
const tenantMemberRoutes = require("./routes/tenant/TenantMemberRoutes");
const paymentRoutes = require("./routes/payment/PaymentRoutes");
require("./script/RentReminderCron");
const allowedOrigins =
    process.env.NODE_ENV === "production"
        ? [
            "https://rentease.com",
            "https://www.rentease.com",
            "https://rentease-rho.vercel.app",
            "https://rentease-rho.vercel.app/"
        ]
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://rentease-rho.vercel.app",
            "https://rentease-rho.vercel.app/"
        ];

app.use(cors({
    origin: true, // 🔓 Temporarily allow all for debugging
    credentials: true, // 🔐 allow cookies (refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tenant-members", tenantMemberRoutes);
app.use("/api/complaints", require("./routes/complaint/ComplaintRoutes"));
app.use("/api/notifications", require("./routes/common/NotificationRoutes"));
app.use("/api/test", require("./routes/common/TestMailRoutes"));
app.use("/api/payment", require("./routes/payment/PaymentRoutes"));
app.use("/api/admin", require("./routes/admin/AdminRoutes"));
app.use("/api/bookings", require("./routes/booking/BookingRoutes"));
app.use("/api/service-provider", require("./routes/serviceProvider/ServiceProviderRoutes"));
app.use("/api/service-provider/reviews", require("./routes/common/ReviewRoutes"));
app.use("/api/announcement", require("./routes/common/AnnouncementRoutes"));
app.use("/api/messages", require("./routes/common/MessageRoutes"));


module.exports = app;
