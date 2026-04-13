# 🐾 Whisker Diary

**All your pet care and home expenses — in one unified system.**

Whisker Diary is a full-stack SaaS-style application designed to help you manage your pets, track expenses, and never miss important reminders — all in a clean, structured, and intuitive interface.

---

## ✨ Core Features

### 🐶 Pet Management

* Create and manage pet profiles
* Track breed, age, notes, and details
* Individual pet timelines (ready for extension)

### 💰 Expense Tracking

* Log daily home expenses
* Monthly summaries and breakdowns
* Clean transaction history

### ⏰ Reminders & Notifications

* Medication schedules
* Vaccination tracking
* Vet visit logs
* Background cron job for notifications

### 🔐 Authentication

* Email/password login
* Google OAuth (via Supabase)
* Secure session handling with JWT

### 📬 Email Notifications

* Automated email alerts via Nodemailer
* Reminder-based triggers (cron powered)

---

## 🧱 Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* React Router
* React Query

### Backend

* Node.js
* Express
* Supabase (PostgreSQL + Auth)
* Zod (validation)

### Infrastructure

* Supabase (DB + Auth)
* Nodemailer (SMTP)
* Cron jobs for background tasks

---

## 📁 Project Structure

```
petcare-home/
├── apps/
│   ├── api/        # Express backend
│   └── web/        # React frontend
├── packages/
│   └── shared-types
└── supabase/
    └── schema.sql
```

---

## ⚙️ Environment Setup

### Backend (`apps/api/.env`)

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

PORT=4000
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM="Whisker Diary <your-email@gmail.com>"
```

---

### Frontend (`apps/web/.env`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🚀 Getting Started

Install dependencies:

```
pnpm install
```

Run backend:

```
pnpm dev:api
```

Run frontend:

```
pnpm dev:web
```

---

## 🔐 Security Notes

* Never commit `.env` files
* Use **service_role key only in backend**
* Use **anon key only in frontend**
* Rotate keys if exposed

---

## 🧭 Roadmap

* Real-time notifications
* Mobile-first UI improvements
* Advanced analytics (expenses & pet health)
* Multi-user family sharing
* Push notification system (in progress)

---

## 🧠 Design Philosophy

Whisker Diary focuses on:

* clarity over complexity
* structured data over scattered notes
* real-life usability over feature overload

---

## 📌 Status

Actively evolving into a **production-grade SaaS application**.

---

## 👨‍💻 Author

Built by **Najmul Hasan**
Full-Stack Developer (MERN / Next.js / TypeScript)

---

## ⭐ Why this project matters

Most pet apps handle only pets.
Most finance apps ignore daily life context.

Whisker Diary combines both — creating a **practical, real-world system** instead of isolated tools.
