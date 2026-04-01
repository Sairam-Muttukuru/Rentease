# 🏢 RentEase: Full-Stack Real Estate Ecosystem

**RentEase** is a comprehensive, premium property management platform designed to bridge the gap between **Landlords**, **Tenants**, and **Service Providers**. It streamlines the entire rental lifecycle—from property discovery and viewing requests to maintenance and automated rent collection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Axios, Lucide Icons, TailwindCSS, SweetAlert2, Framer Motion |
| **Backend** | Node.js, Express.js, PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens), Role-Based Access Control (RBAC), OTP-based Password Reset |
| **Financials** | Stripe API Integration (Payment Gateway), Dynamic Late Rent Calculations |
| **Communication** | Nodemailer (Background Email Processing), Dynamic Announcement Targeting |
| **Utilities** | Google Maps API (Geolocation), Multer (Image Storage) |

---

## 🔥 Key Modules & Role-Based Features

### 👤 Landlord Module (The Management Engine)
*   **Dynamic Property Listing:** List houses, apartments, and PGs with unit-specific details (Room numbers, flat numbers, pricing).
*   **Intelligent Announcements:** Broadcast announcements to entire properties or specific tenants. Includes background email delivery with actual property imagery.
*   **Tenant Management:** Track move-in/move-out dates, occupancy status, and verified tenant details.
*   **Financial Dashboard:** Real-time visualization of rental revenue, pending payments, and payment trends.
*   **Booking Control:** Manage viewing requests from prospective tenants (Approve/Reject).

### 🏠 Tenant Module (The Premium Experience)
*   **Property discovery:** Search and filter properties by city, price, type, and amenities.
*   **Smart Bookings:** One-click viewing requests with automatic status notification.
*   **Integrated Payments:** Pay rent securely via Stripe. Automatic receipt generation.
*   **Maintenance & Complaints:** Raise maintenance requests or complaints. Track resolution status in real-time.
*   **Community Board:** Unified view of all announcements and notices from the landlord.

### 🔧 Service Provider Module (The Support Network)
*   **Category Filtering:** Providers only see jobs related to their skill set (Plumber, Electrician, etc.).
*   **Job Management:** Accept, reject, or mark maintenance jobs as completed.
*   **Earnings Tracking:** Automated calculation of earnings per service rendered.

### 🛡️ Admin Module (The System Guardian)
*   **User Oversight:** Manage and block/unblock users (Landlords, Tenants, and Providers).
*   **Content Moderation:** Flag and disable fraudulent or "Fake" property listings.
*   **Platform Stats:** Global view of platform growth and engagement.

---

## 🚀 Advanced Project Highlights

1.  **Context-Aware Email System:** Emails aren't just text; they dynamically include property hero images, priority-colored themes, and room/flat context for better relevance.
2.  **Background Processing:** Announcement emails are sent in the background using asynchronous Node.js cycles, ensuring the UI remains instant and responsive.
3.  **Local/Cloud Hybrid Config:** Centralized `BASE_URL` management ensures seamless switching between Localhost development and Render.com production environments.
4.  **Unit-Level Targeting:** Specifically designed to handle "PG" logic where a single property name (e.g., *Sairam PG*) can have multiple distinct units (Room 101, 102) with unique targeting.

---

## 📖 Installation & Setup

1. **Clone the Project:**
   ```bash
   git clone <repository-url>
   cd RentEase
   ```

2. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   # Configure your .env (DB_USER, DB_PASSWORD, EMAIL_USER, STRIPE_SECRET...)
   nodemon server
   ```

---

## 🎯 Project Goals & Vision
RentEase is built to digitize the traditionally manual rental market. By focusing on automated communications, secure financials, and direct maintenance channels, it reduces the friction between owners and renters, creating a transparent and efficient marketplace.

---

**Developed with Passion for the Final Year Project.**
