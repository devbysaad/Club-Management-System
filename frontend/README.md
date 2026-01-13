# ⚽ Pato Hornets Club Management System

A comprehensive, full-stack management platform for football clubs and academies. This system streamlines club operations, ranging from player and coach management to financial tracking and kit ordering.

![Club Management](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Prisma%20%7C%20PostgreSQL%20%7C%20Clerk-blue)

---

## 🌟 Overview

The **Pato Hornets Club Management System** is designed to provide a centralized hub for all club-related activities. It offers specialized dashboards for administrators, staff, coaches, players, and parents, ensuring everyone has the tools they need to succeed.

---

## 🚀 Key Features

### 👤 Role-Based Dashboards
- **Admin/Staff:** Complete control over club data, finances, admissions, and personnel.
- **Coach:** Manage training sessions, player attendance, tactics, and performance results.
- **Student/Player:** View schedules, track attendance/performance, and order customized gear.
- **Parent:** Manage children's profiles, monitor progress, and handle fee payments.

### 📅 Event & Training Schedule
- Integrated **Big Calendar** for matches, training sessions, and club events.
- Role-specific schedule visibility.

### 💰 Comprehensive Fee Management
- **Dynamic Fee Plans:** Create monthly, yearly, or one-time fee structures.
- **Automated Record Generation:** Quickly generate monthly fee records for all active players.
- **Payment Tracking:** Record payments (Cash, Card, etc.) with partial payment support and automated status updates.
- **Financial Analytics:** Visual reports of revenue vs. expected income.

### 👕 Customized Jersey Shop
- Fully integrated ordering system for club kits.
- **Customization Options:** Specific size selection (S, M, L, XL), jersey name, number, and custom physical measurements.
- **Order Tracking:** Managed status from Pending to Delivered.

### 📢 Communication & Notifications
- **Announcement System:** Target specific groups (e.g., Coaches only, Parents only) with priority levels.
- **Email Notification Engine:** Professional HTML email templates for:
    - Announcement updates
    - Attendance alerts (Absences)
    - Fee payment receipts
    - Admission status changes
    - Order status updates

### 📊 Performance & Attendance Analytics
- **Visual Charts:** Monitor squad distribution, weekly participation, and financial health.
- **Audit Trails:** Detailed activity logs for administrative transparency.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design System with Glassmorphism)
- **Forms:** React Hook Form & Zod
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **Notifications:** React Toastify

### Backend
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Email Service:** Nodemailer

---

## 📁 Project Structure

```text
├── prisma/               # Database schema and seed data
├── public/               # Static assets & branding
└── src/
    ├── app/              # Next.js App Router (Pages & API routes)
    ├── components/       # Reusable UI components
    │   ├── forms/        # Modal & form components
    │   ├── landing/      # Homepage components
    │   └── ...
    ├── lib/              # Utility functions and server actions
    │   ├── email/        # Email templates & mailer logic
    │   ├── prisma.ts     # Client initialization
    │   └── ...           # Specialized actions (fee, attendance, etc.)
    └── middleware.ts     # Auth & Route protection
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Clerk Account (for Auth)
- SMTP Server (for Emails)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Club Full Stack Project/frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...

   # SMTP
   SMTP_HOST=...
   SMTP_USER=...
   SMTP_PASS=...
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 👥 Credits & Contact

- **Lead Developer:** Saad ([@devbysaad](https://github.com/devbysaad))
- **Club:** Pato Hornets Football Club

---
<<<<<<< HEAD
*Built with ❤️ for the Pato Hornets Community.*
=======
*Built with ❤️ for the Pato Hornets Community.*
>>>>>>> ce07d20ecd577a40a6315b2246e90456bce80117
