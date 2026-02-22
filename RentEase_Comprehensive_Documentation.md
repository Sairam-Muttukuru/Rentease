# RentEase - Comprehensive Project Documentation

RentEase is a modern, full-stack platform designed to simplify property management, rent payments, and home service bookings. It connects **Landlords**, **Tenants**, and **Service Providers** into a unified, highly efficient ecosystem.

---

## 🏗️ Technology Stack

### Frontend (React + Vite)
- **Framework:** React.js 19 with Vite for ultra-fast development and building.
- **Styling:** Tailwind CSS (v4.0) combined with PostCSS for utility-first styling.
- **Routing:** React Router DOM (v7) for handling complex nested layouts and protected routes.
- **State Management & Notifications:** React Toastify for alerts, SweetAlert2 for rich popups.
- **Data Visualization & PDFs:** Recharts for analytics dashboards, `jspdf` and `pdfkit` for generating receipts and reports.
- **Animations & Icons:** Framer Motion for smooth micro-interactions and Lucide React for consistent iconography.
- **Payments:** Stripe integration (`@stripe/react-stripe-js`) alongside Razorpay for versatile checkout experiences.

### Backend (Node.js + Express)
- **Runtime & Framework:** Node.js with Express.js 5.x.
- **Database:** PostgreSQL (pg) serving as the robust relational database engine.
- **Authentication:** JWT (JSON Web Tokens) with `jsonwebtoken` and `bcryptjs` for secure password hashing.
- **Storage:** Cloudinary integrated with Multer (`multer-storage-cloudinary`) for optimized image hosting (property photos, avatars, etc.).
- **Background Jobs:** `node-cron` for scheduling automated tasks like rent reminders.
- **Emails:** Nodemailer for automated system emails.
- **Payments:** Stripe Server SDK (`stripe`) for handling backend payment intents and webhooks.

---

## 🗄️ Database Architecture (PostgreSQL Schema)

The platform relies on a heavily relational PostgreSQL database. Here are the core entities:

### 1. Users (`users`)
Central authentication table for all roles.
- `id` (PK), `first_name`, `last_name`, `email`, `password`, `phone`, `role` (Admin, Landlord, Tenant, ServiceProvider), `avatar_url`.

### 2. Properties (`properties`)
Managed exclusively by Landlords.
- `id` (PK), `landlord_id` (FK), `title`, `description`, `property_type`, `price`, `city`, `locality`, `address`, `bedrooms`, `bathrooms`, `area_sqft`.
- Extended details include: `security_deposit`, `rent_due_day`, `late_penalty_amount`, `bank_account`, `upi_id`, `is_gated`, `parking_type`.

### 3. Tenants & Members (`tenants`, `tenant_members`)
Represents a lease agreement between a User and a Property.
- **`tenants`:** `id` (PK), `landlord_id`, `property_id`, `user_id`, `tenant_type`, `monthly_rent`, `payment_status`, `start_date`, `rent_due_date`.
- **`tenant_members`:** Defines multiple people living under one lease (e.g., family or roommates). Includes `is_primary` flag.

### 4. Service Catalog (`service_types`, `service_sub_types`)
The global catalog maintained by the Admin.
- **`service_types`:** (e.g., "AC and Appliance Repair") - `id` (PK), `category_id`, `name`, `image_url`.
- **`service_sub_types`:** (e.g., "AC Installation") - `id` (PK), `type_id` (FK), `name`, `image_url`.

### 5. Services & Bookings (`services`, `bookings`)
- **`services`:** Specific offerings added by Service Providers with custom pricing. `id` (PK), `provider_id` (FK), `type_id`, `sub_type_id`, `base_price`, `features` (JSONB).
- **`bookings`:** The transaction record when a Tenant requests a service.

---

## 🛣️ API Ecosystem

The backend exposes a well-structured REST API mounted at `/api/*`.

### Authentication & Authorization (`/api/auth`)
- `POST /register`: Registers users and hashes passwords.
- `POST /login`: Authenticates and issues HTTP-only JWT cookies.
- Password Resets: OTP generation and verification flows.

### Landlord Operations (`/api/properties`, `/api/tenants`)
- `GET /properties`: Fetch landlord's portfolio.
- `POST /properties`: List a new property.
- `POST /tenants`: Onboard a new tenant to a property (triggers **Invitation Email**).
- `GET /tenants`: View active leases and rent payment statuses.

### Tenant Operations (`/api/tenant-members`, `/api/complaints`, `/api/payment`)
- `GET /payment/history`: View past rent transactions.
- `POST /complaints`: Raise property issues directly to the landlord.
- **Service Booking flow:** From viewing a complaint, tenants can transition directly to `/api/bookings` to call a Service Provider.

### Service Provider Operations (`/api/service-provider`, `/api/bookings`)
- Providers can fetch global categories, add them to their personal catalog, and set prices.
- `PATCH /bookings/:id/status`: Accept, Reject, or Reschedule incoming jobs (Triggers **Status Update Email** to tenant).

### Admin Operations (`/api/admin`, `/api/announcement`)
- Global system oversight.
- Multi-cast Announcements: Landlords/Admins can broadcast notices to the Tenant Notice Board.

---

## ⚙️ Automated Backend Systems (Cron & Utils)

1. **RentRemiderCron (`/script/RentReminderCron.js`)**
   - A daily cron job that scans the `tenants` table.
   - If `rent_due_date` is approaching (e.g., within 5 days), it compiles an email using Nodemailer and dispatches styling reminders to `tenant_members`.
2. **Dynamic Email Templates (`/utils/Email...`)**
   - The platform sends highly personalized HTML emails for:
     - Welcome Invitations (with property details and login links).
     - Booking Approvals/Rejections (with provider details and timings).

---

## 🔒 Security & Route Protection

- **Frontend:** Employs a strict `ProtectedRoute` higher-order component. If a user with role `TENANT` attempts to access `/landlord-dashboard`, they are intercepted and redirected to `<Forbidden403 />` or forced to log out.
- **Backend:** Middleware validates JWTs on every protected route. `cors` is tightly bound to allowed origins (`localhost:5173` in Dev, `rentease.com` in Prod) and configured to allow credentials (cookies).

---

## 🚀 Setup & Execution Guide

### 1. Environment Configuration
Ensure you have `.env` files in both frontend and backend directories.
**Backend `.env` format:**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=rentease_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_secret_string
CLOUDINARY_URL=cloudinary://...
```

### 2. Dependency Installation
Run `npm install` inside both the root `/` (frontend) and `/Backend` directories.

### 3. Running the Development Servers
Open two terminal instances.
- **Terminal 1 (Backend):** 
  ```bash
  cd Backend
  npm run dev
  ```
  *(Runs `nodemon src/server.js` on port 5000)*
- **Terminal 2 (Frontend):** 
  ```bash
  npm run dev
  ```
  *(Runs `vite` on port 5173)*

### 4. Database Initialization
Use the provided scripts in `/Backend/scripts/` to verify tables and perform potential schema updates (`verify_db.cjs`, `repair_schema.cjs`).
