# 🏗️ RentEase: Deep System Architecture & Functional Specification

This document provides a profound technical and logic-oriented description of the RentEase platform, intended for deep-level AI understanding and project documentation.

---

## 📅 1. System Philosophy & Objectives
**RentEase** is designed to solve the inefficiency and manual overhead of property management. It provides a **Unified Role-Based Workspace** where the interests of Property Owners (Landlords), Residents (Tenants), and Support Staff (Service Providers) intersect seamlessly.

---

## 🧩 2. Core Entity & Database Logic

The system's database (PostgreSQL) is structured around several high-coupling relationships:

*   **Users (Central Hub):** Uses polymorphic behavior to identify roles (Landlord, Tenant, Service_Provider, Admin). All system functions branch from the `user_id`.
*   **Properties (Polymorphic Logic):** One Landlord owns many Properties. Properties are categorized into dynamic types:
    *   *Private:* Houses/Villas.
    *   *Shared Units:* Apartments with sub-flat mapping.
    *   *Collective:* PGs/Hostels with room-level mapping (`flat_number`). 
*   **Tenants & Members:** Uses a dual-table strategy. The `tenants` table tracks the financial and legal relationship between a `user_id` and a `property_id`. The `tenant_members` table tracks children or family members of the primary tenant.
*   **Bookings:** Prospective tenants create viewing requests mapped to `property_id`. Landlords act as "Gatekeepers" who approve/reject these entities via a state machine.
*   **Complaints & Maintenance:** Uses a ticketing logic. `Tickets` are created by tenants, routed to landlords, and then assigned/marked by service providers based on category matching.

---

## ⚙️ 3. Communication Engine (Announcement Targeting)

One of the platform's most advanced features is its **Unit-Specific Messaging Layer**.
*   **The Logic:** When a landlord has a PG with 50 rooms, they shouldn't have to announce "Maintenance" to all rooms if only Room 101 has an issue.
*   **Targeting Chain:** 
    1.  Select Property ID.
    2.  Check for sub-units (Room/Flat IDs).
    3.  Choose Target (Property-Wide vs. Specific ID).
*   **Email Orchestration:** Uses Node.js asynchronous event loops. Emails are triggered in the background so the Landlord UI never freezes. They include dynamic property imagery from the database to improve tenant trust.

---

## 💰 4. Financial & Payment Flow

*   **Rent Cycle:** Landlords define a `rent_due_day` (e.g., 5th of every month) at the property level.
*   **Calculation Logic:** The system calculates rental status (Paid/Unpaid) against the current date. Future versions allow for automated `late_penalty_amount` addition.
*   **Secure Checkout:** Integrated with **Stripe API**. 
    *   Front-end generates a Payment Session.
    *   Back-end verifies the transaction and updates the `rent_payments` table.
    *   Automated Receipt Generation: A professional PDF receipt is created post-payment.

---

## 🛠️ 5. Technical Stack Breakdown (The Deep End)

### **Backend (Node.js/Express)**
*   **Auth:** JWT implementation with `HTTP-Only Cookies` and LocalStorage tracking.
*   **Security Middleware:** `AuthMiddleware` verifies identity; `RoleMiddleware` ensures a Tenant cannot delete an Announcement or a Service Provider cannot approve a Booking.
*   **Mailing Utility:** Uses `Nodemailer`. Advanced templates include **Inline CSS** and **Content ID (CID)** image attachments (like the RentEase logo and property cover photos).

### **Frontend (React)**
*   **Global Context:** `ThemeContext` (Dark/Light Mode) and Auth states.
*   **State Management:** Local states managed via `useState` and `useEffect`, with API calls handled by Axios.
*   **Responsive Design:** Mobile-first dashboards designed with premium UI components (cards, badges, modals).

---

## 🔭 6. Future Roadmap
*   **AI Price Predictor:** Analyze property area and amenities to suggest a competitive rent price.
*   **Native Mobile Support:** Build iOS/Android apps for instant push notifications to tenants.
*   **Document Verification:** Automated Aadhaar/ID verification for tenants using AI OCR.

---

**End of System Manifest.**
This document serves as the Technical Blueprint for the RentEase Property Management Solution.
