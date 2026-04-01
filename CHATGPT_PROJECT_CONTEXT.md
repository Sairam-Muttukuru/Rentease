# 🤖 Mega-Prompt Project Context: RentEase - Your Smart Property Marketplace

This document is a comprehensive technical and functional source of truth for **RentEase**. It is specifically structured for **ChatGPT** to understand the project "wholesomely," accounting for every core module, individual feature, and technical relationship.

---

## 🏗️ 1. Project At-a-Glance
*   **Name:** RentEase
*   **Purpose:** A unified, full-stack real-estate ecosystem connecting landlords, tenants, service providers, and admins.
*   **Stack:** (Vite) React 18, Node.js (Express), PostgreSQL, JWT, Stripe API, Nodemailer.
*   **Configuration:** All API calls use a centralized `BASE_URL` (dynamic local/remote switching).

---

## 👥 2. User Roles & Feature-Set Breakdown

### 👤 A. Landlord Module
The central management workspace for property owners.
*   **Dynamic Listing (House, Apartment, PG/Hostel):** Each property type has unique data fields (BHK, Floor, Amenities, etc.).
*   **Intelligent Unit Management:** Support for sub-units (Room/Flat IDs) within a single property.
*   **Communication Engine:**
    *   **Async Background Emailing:** When posting announcements, the email dispatch doesn't block the UI.
    *   **Unit-Level Targeting:** Select whether an announcement goes to every tenant or specific room IDs.
    *   **Visual Emails:** High-resolution messages with actual property cover images and priority color indicators.
*   **Business Dashboard:**
    *   **Financial Insights:** Revenue charts, payment status distribution.
    *   **Occupancy Control:** Add tenants, manage move-in/move-out via the dashboard.
*   **Booking Pipeline:** View prospective tenant requests for viewings and approve/reject them.

### 🏠 B. Tenant Module
The end-user experience for renting and maintenance.
*   **Search & Discovery:** Browse properties with real-time filters (City, Price range, Property Type).
*   **Secure Payment Portal (Stripe):**
    *   **One-tap rent payment:** Encrypted via Stripe.
    *   **Automatic Receipts:** Instant PDF generation after transaction success.
*   **Maintenance & Complaints Ticketing:**
    *   Tenants raise complaints directly.
    *   Status tracking from 'Pending' to 'In-Progress' to 'Resolved'.
*   **Community Notice Board:** Simplified view for all notices shared by the landlord.

### 🔧 C. Service Provider Module (The Workers)
Plumbers, Electricians, and other maintenance staff.
*   **Category Matching:** Providers only see "Maintenance Jobs" that match their skill profile (Plumbing jobs only for plumbers).
*   **Job Management:** Take on jobs, track time, and mark completed.
*   **Earnings Tracker:** View summary of earned profit from completed service requests.

### 🛡️ D. Admin Module (The Moderator)
The oversight role for platform security.
*   **Fraud Prevention:** "Flag as Fake" feature to disable and hide scam properties.
*   **User Management:** Block/Unblock landlords or tenants violating platform rules.
*   **Global Overview:** Complete stats for all properties listed on the market.

---

## 🧠 3. Advanced Backend Architecture

### **🔒 Security Flows**
*   **JWT Handlers:** Uses dual-token logic in some contexts; `AuthMiddleware` verifies identities on every request.
*   **RBAC (Role Based Access Control):** Custom `RoleMiddleware` ensures only Landlords can post announcements and only Tenants can raise complaints.
*   **OTP Verification:** Secure password resets via temporary one-time passwords delivered via email.

### **✉️ The Communication Engine**
*   Uses a robust `sendMail` utility.
*   Supports **CID (Content ID)** for embedding logos and property images directly in the email body (not just as links).
*   Emails are dispatched in serial `for...of` loops but inside an **async background task** triggered from the controller, ensuring a fast (less than 1s) response time for the user.

### **📁 Database Schema Overview**
*   `Users`: id, first_name, last_name, email, password, role, status.
*   `Properties`: title, description, property_type, price, lat/long, amenities.
*   `Tenants`: link between user, property, and rent cycle.
*   `Announcements`: title, category, priority, property_id, target_type, content.
*   `Bookings`: seeker_id, property_id, request_date, status.

---

## 🎨 4. Frontend & UX Features
*   **Theming:** Advanced Context-based Light/Dark modes using `ThemeContext`.
*   **Atomic UI:** High-quality shared components like `Card`, `Button`, `Badge`, and `Toast`.
*   **Fluid Motion:** Use of Framer Motion (or CSS animations) for page transitions and modal slide-ins.
*   **Geolocation:** Google Maps integration for property location views and locality-based searches.

---

## 🔭 5. Deep Logic Summary
*   **The "PG Logic":** The system treats Unit IDs as a separate targeting layer to help landlords with hostels distinguish residents easily.
*   **The "Late Fee Logic":** Backend tracking of rent due dates vs. current date for future financial reconciliation.
*   **The "API Centralizer":** A single `apiConfig.js` file manages the target URL, preventing frontend communication errors during local development.

---

**End of Master Prompt Context Guide.**
This document captures every logic chain, feature interaction, and backend process for the RentEase project.
