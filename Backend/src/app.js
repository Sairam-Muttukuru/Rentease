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

// === CONCISE JSON API LOGGER ===
app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) return next();

    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logObj = {
            api_call: `${req.method} ${req.url}`,
            status: res.statusCode,
            duration: `${duration}ms`,
        };
        
        if (req.body && Object.keys(req.body).length > 0) {
            // Trim long strings to avoid terminal spam (like base64 images)
            const cleanBody = {};
            for (const key in req.body) {
                if (typeof req.body[key] === 'string' && req.body[key].length > 100) {
                    cleanBody[key] = req.body[key].substring(0, 100) + '...[TRUNCATED]';
                } else {
                    cleanBody[key] = req.body[key];
                }
            }
            logObj.request_body = cleanBody;
        }

        console.log(JSON.stringify(logObj, null, 2));
    });

    next();
});

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
