# RentEase

A full-stack **property rental and management platform** that unifies lease management, rent collection, tenant communication, and home services in one place.

[![Stack](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://reactjs.org/)
[![Stack](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Stack](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)](https://www.postgresql.org/)
[![Stack](https://img.shields.io/badge/Stripe-Payments-6772e5?logo=stripe)](https://stripe.com/)

---

## What is RentEase?

RentEase is a **PropTech** web application for:

- **Landlords** — Manage properties, onboard tenants, track rent, post announcements, and view complaints.
- **Tenants** — Pay rent online, raise maintenance complaints, view notices, and request home services.
- **Service providers** — Manage service catalog and bookings.
- **Admins** — Oversee platform users, properties, complaints, and payments.

All roles use a single React frontend with role-based dashboards and a shared Node.js API.

---

## Features

| Role | Highlights |
|------|------------|
| **Landlord** | Property CRUD, tenant onboarding with welcome email, rent status (PAID/UNPAID/OVERDUE), announcements (notice board), complaints view, property-visit bookings, finance view, notifications. |
| **Tenant** | Lease view, rent payment (Stripe), payment history & receipts, complaints with images, notice board, home service requests, documents, settings (profile, language, theme). |
| **Service provider** | Profile, service catalog (categories/types/sub-types), own services and pricing, bookings, status updates. |
| **Admin** | Dashboard overview, user/property/provider management, complaint resolution, payments & logs. |

**Cross-cutting:** Automated rent reminder emails (cron), JWT auth, forgot password (OTP), change password, in-app notifications, i18n (English, Hindi, Telugu), dark/light theme.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, React Router, Tailwind CSS, Axios, Recharts, Framer Motion, Stripe (Elements), i18next, jsPDF |
| **Backend** | Node.js, Express 5, PostgreSQL (pg), JWT, bcrypt, Stripe (server), Nodemailer, node-cron, Multer + Cloudinary |
| **External** | Stripe (payments), Cloudinary (images), SMTP (transactional email) |

---

## Project Structure

```
Rentease/
├── src/                    # React frontend
│   ├── components/          # UI and role-specific components
│   ├── context/             # Auth, Theme
│   ├── pages/               # Route-level pages
│   ├── locales/             # i18n (en, hi, te)
│   ├── App.jsx
│   └── main.jsx
├── Backend/
│   └── src/
│       ├── config/          # DB, JWT, Stripe, Cloudinary
│       ├── controllers/     # Request handlers
│       ├── middlewares/     # Auth, Role
│       ├── models/          # DB access
│       ├── routes/          # API routes
│       ├── services/        # Business logic
│       ├── script/          # Cron (rent reminders)
│       ├── utils/email/     # Email templates & senders
│       ├── app.js
│       └── server.js
├── package.json             # Frontend
├── vite.config.js
└── README.md
```

---

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+
- **Stripe** account (API keys)
- **Cloudinary** account (optional, for property images)
- **SMTP** credentials (for Nodemailer)

---

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd Rentease

# Frontend
npm install

# Backend
cd Backend
npm install
```

### 2. Backend environment

Create `Backend/.env` (or `Backend/src/.env` as per your dotenv path):

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=rentease
DB_PASSWORD=your_password
DB_PORT=5432

ACCESS_TOKEN_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret

STRIPE_SECRET_KEY=sk_test_...
# Optional: STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP (e.g. for Nodemailer)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

Create the PostgreSQL database and run your schema/migrations (tables: users, properties, tenants, tenant_members, complaints, bookings, rent_payments, announcements, notifications, etc.).

### 3. Run backend

```bash
cd Backend
npm run dev
# Or: node src/server.js
```

Server runs at **http://localhost:5000**. Cron jobs (rent reminders) start with the server.

### 4. Run frontend

```bash
# From project root
npm run dev
```

Frontend runs at **http://localhost:5173** and can proxy `/api` to the backend (see `vite.config.js`). If not using proxy, ensure frontend calls the correct API URL (e.g. `http://localhost:5000`).

### 5. Build for production

```bash
# Frontend
npm run build
# Serve the dist/ folder (e.g. Vercel, Netlify)

# Backend
NODE_ENV=production node src/server.js
# Or use PM2: pm2 start src/server.js --name rentease-api
```

---

## API Overview

| Base path | Description |
|-----------|-------------|
| `/api/auth` | Signup, login, logout, forgot-password, verify-otp, reset-password, change-password, update-profile |
| `/api/properties` | CRUD, list all (with filters), my properties, get by id |
| `/api/tenants` | Dashboard, payments, complaints, profile; landlord: add/update/delete tenant, get by property, all; catalog (categories, types, sub-types, services); service-request |
| `/api/tenant-members` | CRUD for members under a tenant |
| `/api/complaints` | Create (tenant), get tenant/landlord, update status |
| `/api/payment` | create-payment-intent, create-razorpay, rent-payment, security-deposit, download-receipt, landlord-payments |
| `/api/bookings` | Create, my, landlord, by property, update status |
| `/api/service-provider` | Profile, services, catalog, bookings |
| `/api/admin` | Overview, users, properties, complaints, providers, payments, logs |
| `/api/announcement` | Create, get landlord, delete; get tenant |
| `/api/notifications` | Get, mark read, mark all read |

All protected routes expect: `Authorization: Bearer <accessToken>`.

---

## Documentation

- **[INDUSTRY_DOCUMENTATION.md](./INDUSTRY_DOCUMENTATION.md)** — **Industry-style doc** (examiners & recruiters): Overview, architecture, DB design, auth, core modules, payment deep dive, security, scalability, error handling, future, deployment.
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** — Product and feature overview, structure, workflows.
- **[TECHNICAL_ANALYSIS.md](./TECHNICAL_ANALYSIS.md)** — Deep technical breakdown, security, scalability, and improvement roadmap.

---

## License

This project is for educational and portfolio use. Ensure compliance with Stripe, Cloudinary, and any third-party terms when deploying.

---

## Contributors

Final Year Project — RentEase.
