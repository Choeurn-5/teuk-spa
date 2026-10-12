# Teuk Massage & Spa | ទឹកស្ប៉ា

> A luxury, serene spa sanctuary web platform, admin management portal, and Telegram Mini App for **Teuk Massage & Spa** in Siem Reap, Kingdom of Cambodia.

---

## 🌿 Overview & Key Features

* **Client Website**: High-aesthetic luxury presentation featuring treatments, signature packages, photo gallery, gift vouchers, and an interactive multi-step booking stepper.
* **Admin Management Portal (`/admin`)**:
  * Protected dashboard with password authentication and secure cookie session.
  * Real-time booking management with status tabs (All, New Requests, Confirmed, Cancelled/Declined) and pagination.
  * Interactive package and treatment managers with image upload support.
  * Gift voucher generator and validation tools.
* **Telegram Mini App (`/telegram`)**:
  * Native WebApp interface accessible directly inside Telegram via `@TeukSpaBookingBot`.
  * Real-time slot availability checking with capacity controls (`maxCapacity = 3`).
  * Auto-detection of Telegram guest profile (`@username`, First Name, Last Name).
* **Dual-Bot Telegram Architecture**:
  * **Customer Bot (`@TeukSpaBookingBot`)**: Dedicated strictly to guests for booking rituals and receiving confirmation cards.
  * **Staff Bot (`@TeukSpaBot`)**: Dedicated to receptionists for instant booking notifications with interactive `[ ✅ Confirm ]` and `[ ❌ Decline ]` buttons.
* **Automated PDF Invoices**:
  * Server-side PDF generation using `pdfkit` styled with luxury gold accents, treatment breakdowns, payment terms ("Pay at Spa"), and Siem Reap location details.
  * Sent automatically to the guest's Telegram chat upon admin confirmation.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
* **Frontend**: React 19, Tailwind CSS v4, Motion (Framer Motion)
* **Database & Storage**: Google Cloud Firestore & Firebase Admin SDK
* **Messaging & Bot**: Telegram Bot API & Telegram WebApp SDK
* **PDF Generation**: PDFKit
* **Icons & Fonts**: Lucide React, Google Fonts (*Cormorant Garamond*, *Jost*, *Pinyon Script*)

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# Telegram Dual-Bot Setup
TELEGRAM_CUSTOMER_BOT_TOKEN="your_customer_bot_token"
TELEGRAM_STAFF_BOT_TOKEN="your_staff_bot_token"
TELEGRAM_STAFF_CHAT_ID="your_staff_chat_or_group_id"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Import Project**.
3. Under **Environment Variables**, paste the keys from your `.env.local`.
4. Click **Deploy**.
5. Update your Telegram Bot Webhook to point to `https://your-domain.vercel.app/api/telegram/webhook`.
