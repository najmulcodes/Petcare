# 🐾 Whisker Diary

**A full-stack pet care management system for tracking health, expenses, and daily records in one place.**

Whisker Diary centralizes everything a pet owner needs — replacing scattered notes, receipts, and reminders with a structured and consistent system.

---

## ✨ Overview

Pet care involves more than routine — it requires tracking, consistency, and visibility.

Whisker Diary provides:

* Structured pet profiles
* Health and vaccination tracking
* Expense monitoring
* Reminder automation

All within a focused, distraction-free interface.

---

## 🚀 Core Features

### 🐶 Pet Management

* Manage multiple pets
* Profile image upload via Cloudinary
* Store essential details (name, type, notes)

---

### 💉 Health Tracking

* Vaccination records
* Medication logs
* Due date tracking
* Vet notes and follow-ups

---

### 💸 Expense Tracking

* Track daily and monthly expenses
* Categorized spending system
* Monthly summaries
* Clear cost visibility per pet

---

### 🔔 Reminders System

* Scheduled reminders for vaccines and medications
* Background job processing with node-cron
* Email notifications via Nodemailer

---

### 🔐 Authentication

* Email/password authentication
* Google OAuth (Supabase)
* Session persistence and secure token handling

---

### 🖼️ Media Upload

* Direct Cloudinary upload (client-side)
* Optimized image delivery via CDN

---

## 🧠 Architecture Highlights

* Monorepo structure using pnpm workspaces
* Shared types across frontend and backend
* Supabase for authentication and database
* Stateless API with token-based auth
* Background job system for scheduled notifications

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* React Router
* React Query

### Backend

* Node.js
* Express
* TypeScript
* Supabase
* Nodemailer
* Node-cron

### Infrastructure

* Vercel (Frontend)
* Render (Backend)
* Cloudinary (Media)

---

## 📁 Project Structure

```
apps/
  web/        → Frontend (React + Vite)
  api/        → Backend (Express)

packages/
  shared-types → Shared types

supabase/
  schema.sql
```

---

## ⚙️ Environment Setup

### Frontend (`apps/web/.env`)

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:4000

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

---

### Backend (`apps/api/.env`)

```
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

PORT=4000
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
EMAIL_FROM="Whisker Diary <your_email>"
```

---

## 🧪 Run Locally

```bash
pnpm install
pnpm dev:api
pnpm dev:web
```

---

## 🚀 Deployment

### Frontend (Vercel)

* Root: `apps/web`
* Build: `pnpm build`
* Output: `dist`

### Backend (Render)

* Root: `apps/api`
* Build: `pnpm install && pnpm build`
* Start: `pnpm start`

---

## 📌 Roadmap

* User profile settings (avatar, name, DOB)
* Improved password recovery flow
* OCR-based vaccine record scanning
* Push notification support
* Analytics dashboard
* Mobile app (React Native)

---

## 👤 Author

Najmul Hasan (Shariar)
Full Stack Developer (MERN)

---

## 📄 License

MIT
