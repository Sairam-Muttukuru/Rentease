# RentEase: The Ultimate Project Documentation
**Version 1.0 - Comprehensive Deep Dive into Architecture, Roles, Features, and Codebase**

---

## Table of Contents
1.  [Introduction & Project Vision](#1-introduction--project-vision)
2.  [Technology Stack (Deep Dive)](#2-technology-stack-deep-dive)
3.  [Database Architecture (PostgreSQL)](#3-database-architecture-postgresql)
4.  [Core Roles & Permissions](#4-core-roles--permissions)
5.  [Role 1: The Landlord (Detailed Features)](#5-role-1-the-landlord-detailed-features)
6.  [Role 2: The Tenant (Detailed Features)](#6-role-2-the-tenant-detailed-features)
7.  [Role 3: The Service Provider (Detailed Features)](#7-role-3-the-service-provider-detailed-features)
8.  [Role 4: The Admin (Detailed Features)](#8-role-4-the-admin-detailed-features)
9.  [Key Automated Workflows (Cron & Emails)](#9-key-automated-workflows-cron--emails)
10. [Security & Authentication Flow](#10-security--authentication-flow)
11. [Conclusion](#11-conclusion)

---

## 1. Introduction & Project Vision

**RentEase** is an expansive, modern, full-stack web application that completely revolutionizes the rental and property management industry. It represents the intersection of two massive markets: **PropTech** (Property Technology) and the **Gig Economy** (on-demand home services).

### The Problem It Solves
Historically, a tenant's experience is highly fragmented. They sign a lease on paper, pay rent via bank transfer, report a broken water heater via a WhatsApp message to the landlord, and then have to go to a separate application (like UrbanCompany or Yelp) to find a plumber if the landlord tells them to handle it themselves. 
For landlords, managing multiple properties means juggling spreadsheets, chasing down late rent payments, and constantly answering phone calls about maintenance issues.

### The RentEase Solution
RentEase centralizes everything into a single, unified digital platform with distinct dashboards for distinct roles. 
- **For Landlords:** It is a property management suite.
- **For Tenants:** It is a home management and service booking suite.
- **For Service Providers:** It is a lead generation and job management suite.
- **For Admins:** It is the overarching control panel keeping the ecosystem healthy.

By bringing the Service Providers directly into the same app where Tenants pay rent and raise complaints, RentEase creates a seamless lifecycle from *identifying a problem* to *booking the professional to fix it*.

---

## 2. Technology Stack (Deep Dive)

RentEase utilizes a robust, production-ready MERN-variant stack, replacing MongoDB with a highly structured relational PostgreSQL database.

### Frontend Architecture (Client-Side)
- **Framework:** React.js (v19) combined with Vite. Vite provides instant server start and lightning-fast Hot Module Replacement (HMR).
- **Styling:** Tailwind CSS (v4.0). The entire application uses utility-first CSS, ensuring the UI is highly responsive, modern, and consistent without bloated external stylesheets.
- **Routing & Protection:** React Router DOM (v7). The app relies on a higher-order component (`ProtectedRoute.jsx`) to wrap sensitive routes. If a user does not have the correct role stored in their JWT token, they are immediately redirected or shown a `<Forbidden403 />` page.
- **Micro-Interactions & UX:** Framer Motion is used for layout transitions and smooth animations, making the application feel premium and snappy.
- **Data Visualization:** Recharts is used on the dashboards to render beautiful, interactive SVGs showing payment histories, booking trends, and property analytics.
- **Icons & Alerts:** Lucide React provides crisp, scalable SVG icons. React-Toastify and SweetAlert2 handle non-blocking notifications and stylized confirmation modals.
- **Payments:** Integrated tightly with `@stripe/react-stripe-js` and Razorpay for handling complex checkout flows directly in the React components without redirecting away from the app.
- **PDF Generation:** Using `jspdf` to generate rent receipts and booking invoices directly on the client side.

### Backend Architecture (Server-Side)
- **Runtime Environment:** Node.js.
- **Framework:** Express.js (v5.x). Express handles the robust routing architecture, breaking down endpoints by domain (e.g., `/api/landlord`, `/api/tenant`).
- **Authentication:** Custom JWT implementation using `jsonwebtoken` to issue HTTP-only cookies that prevent XSS attacks. Passwords are salted and hashed using `bcryptjs` before ever hitting the database.
- **File Uploads & Storage:** `multer` combined with `multer-storage-cloudinary` intercepts multipart form data (like property images or user avatars) and streams it directly to Cloudinary, ensuring the Node server's local storage isn't clogged with heavy media files.
- **Scheduled Tasks:** `node-cron` runs in the background. Every day at a specified time, it combs the PostgreSQL database to find tenants whose rent is due soon and dispatches emails.
- **Email Delivery:** `nodemailer` constructs dynamic HTML email templates for everything from welcoming new tenants to notifying users that their booked plumber has accepted the job.
- **Payment Processing:** Stripe server SDK handles the creation of Payment Intents and validates Webhook events to ensure payments are legitimately completed.

---

## 3. Database Architecture (PostgreSQL)

Unlike NoSQL databases, RentEase requires strict data integrity, which is why PostgreSQL is utilized. Below is the exhaustively detailed schema map of the entire platform:

### Core User & Property Tables
**1. `users` Table**
The bedrock of the platform. Every human interacting with the app has a row here.
- `id` (Primary Key, Auto-increment)
- `first_name`, `last_name` (Varchar)
- `email` (Unique Varchar)
- `password` (Hashed Text)
- `phone` (Varchar)
- `role` (Enum/Varchar: 'ADMIN', 'LANDLORD', 'TENANT', 'SERVICE_PROVIDER')
- `avatar_url` (Text, Cloudinary URL)
- `created_at`, `updated_at` (Timestamps)

**2. `properties` Table**
Created and owned by a Landlord.
- `id` (PK)
- `landlord_id` (Foreign Key referencing `users.id`)
- `title`, `description` (Varchar, Text)
- `property_type` (e.g., Apartment, Villa, Commercial)
- `price`, `security_deposit` (Numeric - storing exact financial values)
- `city`, `locality`, `address` (Location data for robust searching)
- `bedrooms`, `bathrooms`, `area_sqft` (Physical attributes)
- `is_featured`, `is_gated`, `has_lift` (Boolean flags)
- `rent_due_day` (Int: e.g., '5' means rent is due on the 5th of every month)
- `late_penalty_amount` (Numeric)
- `bank_account`, `ifsc_code`, `upi_id` (Where the landlord receives offline/direct money)

**3. `property_images` & `property_amenities` Tables**
One-to-many relationship tables linking a property to an array of Cloudinary URLs and predefined amenity tags (e.g., "WiFi", "Pool").

### The Lease Engine Tables
**4. `tenants` Table**
The bridge connecting a User, a Landlord, and a Property. It represents an active Lease.
- `id` (PK)
- `landlord_id` (FK to `users`)
- `property_id` (FK to `properties`)
- `user_id` (FK to `users` - the actual tenant logging in)
- `tenant_type` (e.g., 'Family', 'Bachelor')
- `monthly_rent` (Numeric - overriding the property base price if negotiated)
- `payment_status` (Enum: 'PAID', 'UNPAID', 'OVERDUE')
- `start_date`, `rent_due_date` (Date tracking for the Cron jobs)

**5. `tenant_members` Table**
Allows multiple people (roommates, spouses) to exist under a single `tenants` lease ID.
- `id` (PK)
- `tenant_id` (FK to `tenants`)
- `full_name`, `phone`, `tenant_emailid`
- `is_primary` (Boolean - identifies the head of household who pays the rent)

### The Gig Economy Tables (Services)
**6. `service_types` & `service_sub_types` Table**
Managed by Admins. Represent the global categories.
- `id`, `name` (e.g., "AC Repair"), `image_url`.

**7. `services` Table**
Created by Service Providers. When a provider wants to offer "AC Repair", they create a row here linking the global type to their personal profile.
- `id` (PK)
- `provider_id` (FK to `users` where role is SERVICE_PROVIDER)
- `type_id`, `sub_type_id` (FK mapping to global categories)
- `base_price` (Numeric - Provider sets their own price)
- `features` (JSONB - e.g., `["Gas Refill", "Coil Cleaning"]`)

**8. `bookings` Table**
The transactional record between Tenant and Provider.
- `id` (PK)
- `tenant_id` (FK to `users`)
- `provider_id` (FK to `users`)
- `service_id` (FK to `services`)
- `booking_date`, `time_slot` (When the work happens)
- `status` (Enum: 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'RESCHEDULED')
- `total_price` (Numeric)

---

## 4. Core Roles & Permissions

RentEase implements strict Role-Based Access Control (RBAC). 
- A user's role is defined at the time of registration.
- The JWT issued upon login contains this role payload (e.g., `{ userId: 123, role: 'LANDLORD' }`).
- Every single backend API route utilizes a middleware (e.g., `verifyLandlord`) that decrypts the token. If a Tenant's token is used to hit a `DELETE /api/properties/:id` route, the backend rejects it with a `403 Forbidden` long before the database is ever queried.

---

## 5. Role 1: The Landlord (Detailed Features)

The Landlord acts as a property manager. Their dashboard is highly analytical and action-oriented.

### Completely Manage Property Portfolios
- **Create Listings:** Landlords use an extensive multi-step form to upload properties. They define not just the physical layout (BHK, area) but complex financial policies: *Security Deposits, Late Penalties, Rent Escalation terms, and custom guidelines (e.g., "No Pets").*
- **Media Uploads:** Directly drag-and-drop images which securely transmit to Cloudinary.
- **Edit/Delete:** Full CRUD operations over their entire portfolio.

### The Tenant Onboarding Engine (Massive Feature)
- When a Landlord finds a tenant in the real world, they "Add Tenant" via the RentEase dashboard.
- The Landlord links the tenant to a specific property and defines the start date and customized rent amount.
- **The Magic:** As soon as the Landlord hits "Submit", the RentEase backend instantly fires an HTML-formatted **Welcome Email** via Nodemailer to the new tenant. This email contains the property address, the landlord's contact info, and a magic link advising the tenant to log into RentEase to view their dashboard.

### Rent Tracking & Financials
- The dashboard visually maps out which tenants are "PAID", "UNPAID", or "OVERDUE".
- Landlords do not need to manually text tenants asking for money. The system automatically shifts statuses to 'OVERDUE' based on the `rent_due_day` stored in the database.

### Broadcasting Announcements
- **Feature:** Notice Board Post.
- A Landlord can draft a message: *"Elevator maintenance happening tomorrow from 10 AM to 2 PM."*
- Upon publishing, this announcement is written to the database and instantly appears on the dashboard of *every single tenant* currently linked to that Landlord's properties. No more printing flyers or sending 50 WhatsApp messages.

### Complaint Monitoring
- Landlords have a dedicated "Complaints" tab. They see issues raised by tenants (e.g., "Leaky Faucet"). They can track the status of these complaints, ensuring their properties are maintained.

---

## 6. Role 2: The Tenant (Detailed Features)

The Tenant experience is designed to drastically improve the Quality of Life for a renter. It turns their lease into an interactive, mobile-friendly application.

### Financial Management (Rent Payments)
- **Dashboard Visibility:** The moment a Tenant logs in, they see their active lease. They see exact financial breakdowns: Base Rent, Late Fees, and total Due.
- **Integrated Checkout:** Clicking "Pay Rent" opens a seamless Stripe or Razorpay modal. The tenant enters their card/UPI details and pays without leaving the app.
- **Payment History:** The backend records all `rent_payments` transactions. Tenants have a beautiful table showing their historical payments, ensuring absolute transparency. They can even generate PDF receipts for their own sub-taxes.

### The Flagship Feature: Home Services Marketplace
- Instead of calling a landlord for every minor issue, tenants can navigate to the **Home Services** tab.
- **Browsing:** The frontend pulls down all active services listed by all Service Providers on the platform. The UI groups them intuitively (Cleaning, Plumbing, AC Repair).
- **Booking Flow:** The tenant clicking "AC Repair" sees a list of specific providers offering that service, along with their custom prices. 
- **Checkout:** The tenant selects a date and a time slot, and clicks "Book Service". This inserts a `PENDING` booking into the database.
- **Live Email Tracking:** The tenant doesn't have to keep refreshing the app. Whenever the Service Provider interacts with that booking, the RentEase backend fires an email to the tenant: *"Good news! Your AC Repair booking has been APPROVED."*

### Complaint & Maintenance Portal
- Tenants can log a complaint, attaching images of the damage.
- **Seamless Transition:** The UI features a genius UX flow. If a tenant views their "Leaky Faucet" complaint, there is a prominent button: *"Need this fixed now? Book a Plumber."* Clicking this redirects them directly into the Home Services marketplace with the "Plumbing" category pre-selected.

### The Notice Board
- A centralized feed displaying all global Admin announcements and localized Landlord announcements.

---

## 7. Role 3: The Service Provider (Detailed Features)

RentEase isn't just a property app; it contains an entire "Gig Economy" micro-SaaS specifically for local contractors.

### Catalog Curation & Pricing Autonomy
- A Service Provider logs in to an entirely different UI. They do *not* see property listings or rent payments.
- **Building a Profile:** They browse the "Global Admin Catalog" (e.g., Appliance Repair).
- **Custom Services:** They add "AC Installation" to their personal catalog. *Crucially, they set their own Base Price.* If Provider A charges ₹1500 and Provider B charges ₹2000, both will show up in the Tenant marketplace.
- They can add specific bullet-point features stored as JSONB in the database (e.g., ["Include Gas Refill", "30 Min Service"]).

### Job Pipeline Management
- **The Inbox:** Providers have a dashboard showing incoming `PENDING` job requests submitted by tenants.
- **Total Control:** They review the date, the time, and the location. They can click **Accept**, entirely confirming the gig.
- **Rejection/Rescheduling:** If they are busy, they can click **Reject**, or they can propose a newly **Rescheduled** timestamp.
- Every single button click triggers an API call that updates the PostgreSQL backend, which in turn automatically fires an email to the Tenant informing them of the Provider's decision. 

---

## 8. Role 4: The Admin (Detailed Features)

The Admin is the god-level user ensuring the ecosystem remains organized and safe.

### Global Catalog Master
- To prevent 50 different spellings of "Air Conditioning Repair", Service Providers cannot create whatever categories they want.
- **The Master Strategy:** The Admin uses the dashboard to create the official `service_types` and `service_sub_types` catalogs. They assign intuitive icons and descriptions.
- Providers merely "subscribe" to these global categories. This ensures the Tenant-facing marketplace remains beautifully categorized and standardized, much like Amazon or UberEats.

### User & Platform Moderation
- Admins possess the ability to query the entire `users` table. They can oversee how many Landlords, Tenants, and Providers are active.
- Admins can broadcast system-wide "Global Announcements" (e.g., "The platform will be down for maintenance on Sunday") that push to the Notice Boards of every single user role.

---

## 9. Key Automated Workflows (Cron & Emails)

The true power of RentEase lies in what it does *while you aren't looking*. The backend automates the most annoying parts of property management.

### The RentReminderCron Engine (`src/script/RentReminderCron.js`)
- **How it works:** A `node-cron` package runs a scheduler instance on the Express server.
- **The Query:** Once a day (e.g., midnight), it queries the PostgreSQL database: *"Find all `tenants` where `payment_status` is 'UNPAID' and the current date is exactly 5 days away from `rent_due_date`."*
- **The Action:** For every match, the system grabs the tenant's email address from the `tenant_members` table.
- It spins up a `nodemailer` transport instance.
- It dynamically compiles an HTML email template injecting the Tenant's Name, the Property Title, the Amount Due, and a hyperlink taking them straight to the Razorpay checkout page.
- **The Result:** Landlords literally never have to text a tenant asking for rent again. It happens perfectly, every single month, autonomously.

### The Transactional Notification System
- Throughout the `BookingRoutes` and `TenantRoutes` in the Express Backend, there are hooks attached to `UPDATE` database queries.
- Examples: 
  - `UPDATE bookings SET status = 'APPROVED' WHERE id = 123;` -> *Triggers Nodemailer Approval Template.*
  - `UPDATE bookings SET status = 'REJECTED' WHERE id = 123;` -> *Triggers Nodemailer Rejection Template.*

---

## 10. Security & Authentication Flow

Because RentEase handles sensitive financial and housing data, the security architecture is paramount.

1. **Password Hashing:** When a user submits the `Signup.jsx` form, the password travels over HTTPS to the backend. The Auth Controller uses `bcrypt.hash()` with salt to garble the password. The plaintext is **never** saved in PostgreSQL.
2. **JWT Issuance:** Upon successful `/api/auth/login`, the server generates a JSON Web Token signed with a highly secure `JWT_SECRET`.
3. **Cookie Delivery:** This token is shipped back to the React client inside an `httpOnly` cookie. This means malicious JavaScript running in the browser cannot read the token, thwarting Cross-Site Scripting (XSS) attacks.
4. **CORS:** The Express server is strictly locked down. If `NODE_ENV=production`, it will drop any API request that doesn't originate from `https://rentease.com`.
5. **Route Level Guards:** Every protected backend controller checks `req.user.role`. A Service Provider token cannot access `/api/properties` endpoints, hard-stopping privilege escalation attacks.

---

## 11. Conclusion

**RentEase** represents a massive technical achievement. It isn't merely a CRUD app; it is three heavily interwoven micro-platforms (Property Management, Gig Marketplace, Payment Gateway) running on a single, highly optimized relational PostgreSQL database. 

By automating communication through dynamic emails, automating rent collection through Cron jobs, and centralizing home maintenance through a fully-featured service dashboard, RentEase successfully eradicates the friction of modern property renting for all parties involved. It is scalable, secure, and architected natively for the digital age.
