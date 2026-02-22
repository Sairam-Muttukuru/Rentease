# RentEase - Comprehensive Project Documentation

Welcome to the documentation for **RentEase**, a complete property management and service booking platform. RentEase is built to seamlessly connect Landlords, Tenants, and Service Providers into a unified, efficient ecosystem.

---

## 🏗️ Technology Stack

RentEase is built using modern web development technologies:
- **Frontend:** React.js (with Vite), Tailwind CSS for styling.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (using Mongoose models).
- **Payment Gateway:** Razorpay integration for secure transactions.
- **Notifications:** Automated Email system (NodeMailer or similar utilities).

---

## 👥 User Roles & Core Workflows

The platform is strictly role-based, ensuring each user type gets a tailored experience and access to relevant tools.

### 1. Landlord 🏢
The Landlord role is designed to simplify property and tenant management.
- **Property Management:** Landlords can list properties, update details, and oversee their entire portfolio from a centralized dashboard (`LandlordDashboard.jsx`).
- **Tenant Management & Onboarding:** Landlords can assign tenants to properties and automatically trigger sophisticated **Invitation Emails** containing property details and onboarding links.
- **Rent Tracking & Reminders:** Provides a clear view of who has paid rent. The system includes an automated feature to send **Rent Reminder Emails** (e.g., daily reminders starting 5 days before the rent due date).
- **Notice Board / Announcements:** Landlords can broadcast announcements or notices to all their tenants simultaneously.
- **Booking & Complaint Oversight:** Landlords can view service bookings and complaints raised by their tenants to stay informed about property maintenance.

### 2. Tenant 🏠
The Tenant role focuses on convenience, communication, and transparency.
- **Rent Payments:** Tenants can securely pay their rent online using the integrated **Razorpay** checkout (`RentPayment.jsx`), and view their complete payment history with correct currency formatting (₹).
- **Home Services Booking:** A stand-out feature where tenants can browse a catalog of home services (cleaning, plumbing, AC repair, etc.), view pricing, and seamlessly book a **Service Provider** right to their door (`TenantHomeServices.jsx`).
- **Complaints & Maintenance:** Tenants can raise complaints about property issues. Taking it a step further, the system allows tenants to instantly transition from a complaint detail page directly into booking a relevant home service.
- **Notice Board:** Tenants have a dedicated view to see announcements posted by their landlord.
- **Booking Tracking:** Tenants receive email notifications about their service booking statuses (Accepted, Rejected, Rescheduled).

### 3. Service Provider 🛠️
This role is for independent professionals or companies offering home maintenance services.
- **Service Catalog Management:** Service providers can select from a global catalog of service types/categories (e.g., "AC Installation" under "AC and Appliance repair"), add these to their profile, and set custom pricing (`ServiceProvider.jsx`).
- **Job Management:** Providers receive incoming booking requests from tenants. They have full control to **Accept, Reject, or Update the status** of these jobs.
- **Notification Triggers:** When a provider updates a booking status, the system automatically dispatches status update emails to the concerned tenant.

### 4. Admin 🛡️
Used for overarching platform control.
- **Global Management:** Manages overarching categories, system settings, global service catalogs, and platform-wide user health (`Adminpage.jsx`).

---

## ⚙️ Key Architectural Features

### Authentication & Authorization Flow
- **Registration & Login:** Secure flows for each role (`LoginPage.jsx`, `Signup.jsx`).
- **Password Management:** Includes `ForgotPassword.jsx` and `ResetPassword.jsx` flows with completely integrated OTP verification (`VerifyOtp.jsx`).
- **Protected Routing:** The application uses strictly enforced protected routes (`ProtectedRoute.jsx`, `DashboardRedirect.jsx`, `Forbidden403.jsx`) to ensure that, for instance, a tenant cannot access the landlord dashboard.

### Service & Booking Engine
- The booking system connects Tenants and Service Providers bidirectionally.
- Tenants can initiate bookings logically categorized by service type.
- Providers see isolated dashboards displaying *only* the services they offer and the jobs requested of them.

### Automated Communication (Email Service)
A highly sophisticated backend utility handles automated communications:
- **Tenant Invitations:** Welcome emails with property info.
- **Rent Reminders:** Scheduled cron-job style emails for due payments.
- **Booking Statuses:** Real-time email updates when service bookings jump from 'Pending' to 'Approved' or 'Declined'.

---

## 📁 Directory Structure Overview

### Frontend (`/src`)
- **`/components`**: Reusable UI parts separated by role (`/landlord`, `/tenant`, `/chat`, `/ui`).
- **`/pages`**: Top-level route components containing the heavy-lifting logic (`LandlordDashboard`, `TenantDashboard`, `ServiceProvider`, `HomeServices`).
- **`/assets` & `/locales`**: Static assets and internationalization configurations.

### Backend (`/Backend/src`)
Organized by Domain-Driven Design principles:
- **`/models`**: Schema definitions separated strictly by role and function (`admin`, `booking`, `common`, `complaint`, `landlord`, `serviceProvider`, `tenant`).
- **`/controllers` & `/routes`**: API request handlers.
- **`/services`**: Core business logic separating database calls from API mechanics.
- **`/utils`**: Helper functions (e.g., mailers, validators).
- **`/scripts`**: Utility scripts for database migrations, schema inspections, and char limit updates.

---

## 🌟 Summary
RentEase acts as a powerful trifecta system. By digitizing rent payments, automating administrative communications, and seamlessly integrating a gig-economy style home service booking engine, it elevates standard property management into a modern, fully-featured PropTech solution.
