# The RentEase Project Report
**A Comprehensive Overview of Concept, Features, and Architecture**

---

## 1. What is RentEase? (Executive Summary)

**RentEase** is an innovative, full-stack web application designed to bridge the gap between traditional property management and the modern "gig economy" of home services. 

At its core, RentEase serves as a unified digital ecosystem where **three distinct user groups** interact:
1. **Landlords** who need a centralized dashboard to track their properties, manage tenant life-cycles, and monitor rent payments.
2. **Tenants** who want a seamless, app-based experience to pay rent, raise maintenance complaints, and instantly book professional home services.
3. **Service Providers** (e.g., plumbers, electricians, cleaners) who want a platform to list their specific skills, manage incoming job requests from tenants, and build a local business footprint.

Instead of a tenant having to pay rent on one app, text their landlord about a broken AC on a second app, and use a third app to find an AC repairman, **RentEase brings all of those actions under one unified roof.**

---

## 2. The Problems RentEase Solves

Before RentEase, the property rental ecosystem suffered from fragmentation:
- **Disjointed Communication:** Landlords and tenants rely on messy WhatsApp groups or phone calls for notices, rent reminders, and complaints.
- **Maintenance Nightmares:** When a pipe breaks, the tenant complains to the landlord. The landlord then has to hunt down a plumber, coordinate timings, and negotiate prices. It is slow and frustrating for everyone.
- **Manual Financial Tracking:** Rent collection is often tracked on spreadsheets or mental notes, leading to disputes over who paid what and when.

**The RentEase Solution:**
RentEase digitizes the entire relationship. Rent logic is automated, communication is centralized via Notice Boards and automated emails, and property maintenance is offloaded directly to a marketplace of independent Service Providers working right inside the app.

---

## 3. Deep Dive: Key Features Implemented

RentEase provides a highly tailored experience depending on the type of account you log into.

### 🏢 Features for Landlords
The Landlord experience is built around control, visibility, and automation.
- **Property Portfolio Management:** Landlords can easily list new properties with extensive details (photos, rent amount, security deposits, amenities, rules).
- **Tenant Onboarding (The "Lease" Engine):** Landlords can assign a user as a tenant to a specific property. This instantly triggers the backend to send a **Welcome/Invitation Email** to the tenant's inbox, containing property details and login links.
- **Rent Tracking & Automated Reminders:** The dashboard displays who has paid rent and who is pending. To stop landlords from having to chase tenants, RentEase features a background "Cron Job" that automatically emails tenants a **Rent Reminder** 5 days before their rent is actually due.
- **Notice Board / Announcements:** Need to tell everyone the water will be shut off on Tuesday? Landlords can post an announcement that instantly broadcasts to the dashboards of all their active tenants.
- **Complaint Monitoring:** Landlords can view a log of all property complaints raised by their tenants.

### 🏠 Features for Tenants
The Tenant experience focuses on mobile-first convenience and transparency.
- **Digital Rent Payments:** Tenants can view their active lease details and pay rent securely using integrated payment gateways (like Razorpay/Stripe). The platform correctly localizes currency to Indian Rupees (₹).
- **The Home Services Marketplace:** *This is the flagship feature.* Tenants can browse a beautifully categorized catalog of home services (e.g., "Cleaning", "AC & Appliance Repair"). They can view prices, see provider ratings, and book a service provider directly to their flat.
- **Integrated Complaints:** If a tenant finds a broken fixture, they can log a complaint. RentEase allows them to transition *directly* from viewing that complaint into booking a relevant service provider to fix it.
- **Automated Booking Tracking:** Tenants don't have to guess if a plumber is coming. They receive automated Email Notifications the moment a Service Provider "Accepts", "Rejects", or "Reschedules" their booking.

### 🛠️ Features for Service Providers
This role turns RentEase into a gig-economy platform like UrbanCompany.
- **Personalized Catalogs:** Service providers have a standalone dashboard. They can browse the "Global Service Catalog" (created by the Admin) and add specific services to their profile (e.g., selecting "AC Installation"), setting their own base prices.
- **Job Management Board:** Providers receive booking requests from tenants. They have full authority to Accept the job, Reject it, or propose a new Rescheduled time. 
- Providers only see *their* specific jobs, completely isolated from other providers on the platform.

### 🛡️ Features for Admins
- **Global Control:** Admins define the overarching service categories (Master Catalog) that Service Providers choose from. They can also moderate users and broadcast platform-wide announcements.

---

## 4. Key Technical Workflows

How do these features actually work under the hood?

### Workflow A: The Tenant Onboarding Flow
1. **Action:** Landlord clicks "Add Tenant" on their dashboard and enters the user's details and lease terms.
2. **Backend Engine:** The Node.js server securely inserts a record into the PostgreSQL `tenants` table, linking the Landlord, the User, and the Property together.
3. **Automation:** The server immediately triggers the `Nodemailer` utility, generating a styled HTML email welcoming the tenant to the property and dispatching it to their inbox.

### Workflow B: The Service Booking Lifecycle
1. **Discovery:** A tenant navigates to `TenantHomeServices.jsx` (React Frontend). The page fetches the catalog from the Express backend API.
2. **Transaction:** The tenant books an AC Repair. A new record is created in the `bookings` database table with a status of `PENDING`.
3. **Provider Action:** The Service Provider logs in, sees the pending request, and clicks "Accept". The database updates the status to `APPROVED`.
4. **Notification:** The backend listens for this status change and automatically fires an email to the Tenant: *"Your AC Repair booking has been approved for tomorrow at 2 PM."*

### Workflow C: Secure Authentication & Routing
- When anyone logs in, the backend verifies their password using `bcryptjs` and generates a secure JSON Web Token (JWT).
- The React frontend uses a strictly enforced `<ProtectedRoute />` wrapper. If a user with a "Tenant" token tries to type the URL for the "Landlord Dashboard", the system instantly blocks them and renders a `403 Forbidden` page, protecting user privacy and data.

---

## 5. Summary

RentEase is not just a digital ledger; it is a **comprehensive PropTech (Property Technology) solution**. By seamlessly blending property administration (rent, leases, notices) with a robust gig-service marketplace (plumbers, cleaners, electricians), RentEase entirely modernizes the way we manage, live in, and maintain rental properties.
