# 🐾 Whisker Diary

**A full-stack pet care management system for tracking health records, expenses, and scheduled reminders — built as a production-structured portfolio project.**

> Built with React, Node.js/Express, Supabase, and Cloudinary in a pnpm monorepo. Demonstrates real-world concerns: JWT-based auth, background job processing, shared types across a full-stack TypeScript codebase, and structured API design.

---

## Overview

Pet care is fragmented — vaccine cards in drawers, medication schedules in notes apps, vet receipts in folders. Whisker Diary centralizes it into a single structured system with automated reminders and a clean, mobile-friendly interface.

This is not a tutorial project. The architecture reflects decisions you'd make in a real product: ownership enforcement at the service layer, environment-aware configuration, graceful server shutdown, and a background job system with retry logic.

---

## Features

### Pet Management
- Multi-pet support per user
- Profile images via Cloudinary (client-side upload with CDN delivery)
- Detailed profiles: breed, DOB, gender, color, weight history, notes

### Health Tracking
- Vaccination records with next-due date tracking
- OCR-assisted vaccine card scanning (Tesseract.js, client-side)
- Medication logs with dosage, frequency, and active/inactive state
- Vet visit history with cost tracking

### Expense Tracking
- Household expenses with custom categories (name, color, icon)
- Per-pet expense tracking with predefined categories (food, medicine, vet, accessories)
- Monthly filtering and cost summaries

### Reminder System
- Background job queue (BullMQ + Redis) for scheduled notifications
- Email reminders for upcoming vaccinations and medication end dates
- Per-job retry logic — failed jobs do not block the queue
- Jobs are enqueueable on-demand (POST /api/v1/reminders/trigger) and run on a scheduled sweep

### Authentication
- Email/password auth via Supabase
- Google OAuth
- Stateless API — all protected routes validated via JWT on every request
- Password reset flow with modal UX

---

## Engineering Notes

**Monorepo (pnpm workspaces):** Frontend, backend, and shared types are separate packages. `@whiskerdairy/shared-types` is referenced by both `apps/web` and `apps/api`, preventing type drift between the API contract and the client.

**Ownership enforcement:** Every write operation (update, delete) is guarded at the service layer with an explicit ownership check, not just at the route level. This prevents IDOR vulnerabilities that are common in junior-level portfolio projects.

**Background jobs:** The reminder system uses BullMQ with a Redis-backed queue. Jobs are retried up to 3 times with exponential backoff. The worker runs in the same Node process to keep infrastructure minimal while demonstrating correct separation between the job producer and consumer.

**Stateless API:** No sessions. Every request carries a JWT verified by Supabase's JWKS. The Express middleware extracts `user.id` and passes it down to services — user identity is never trusted from the request body.

**Environment config:** All env vars are parsed and validated at startup (`src/config/env.ts`). The server refuses to start if required vars are missing — no silent runtime failures.

**Graceful shutdown:** The server handles `SIGTERM` cleanly, which matters on platforms like Render that send SIGTERM before recycling containers.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), TypeScript, Tailwind CSS, React Query, React Router |
| Backend | Node.js, Express, TypeScript |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| Job Queue | BullMQ + Redis |
| Media | Cloudinary |
| Email | Nodemailer (SMTP) |
| Monorepo | pnpm workspaces |
| Deploy | Vercel (web), Render (api) |

---

## Project Structure

```
whiskerdiary/
├── apps/
│   ├── web/                  # React + Vite frontend
│   │   └── src/
│   │       ├── components/   # Shared UI components (Button, Modal, Badge...)
│   │       ├── hooks/        # React Query hooks per domain
│   │       ├── pages/        # Route-level page components
│   │       └── lib/          # API client, Supabase client, utilities
│   └── api/                  # Express backend
│       └── src/
│           ├── config/       # Env validation
│           ├── jobs/         # BullMQ worker and queue definitions
│           ├── lib/          # Supabase admin client, email sender
│           ├── middleware/   # Auth, error handler, Zod validation
│           ├── modules/      # Feature modules (pets, vaccinations, expenses...)
│           └── routes/       # Central router
├── packages/
│   └── shared-types/         # Shared TypeScript types (consumed by web + api)
└── supabase/
    └── schema.sql            # Full DB schema (run once in Supabase SQL editor)
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- A Supabase project
- A Cloudinary account
- Redis (local or [Upstash](https://upstash.com) for hosted)
- SMTP credentials (Gmail app password works)

### 1. Clone and install

```bash
git clone https://github.com/yourname/whiskerdiary.git
cd whiskerdiary
pnpm install
```

### 2. Set up the database

Run `supabase/schema.sql` in the Supabase SQL Editor.

### 3. Configure environment variables

**`apps/api/.env`**
```env
PORT=4000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ALLOWED_ORIGINS=http://localhost:5173

REDIS_URL=redis://localhost:6379

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Whisker Diary <your@gmail.com>"
```

**`apps/web/.env`**
```env
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

### 4. Run

```bash
pnpm dev:api   # starts Express on :4000
pnpm dev:web   # starts Vite on :5173
```

---

## Deployment

### Frontend → Vercel
- Root: `apps/web`
- Build command: `pnpm build`
- Output directory: `dist`
- Add all `VITE_*` env vars in the Vercel dashboard

### Backend → Render
- Root: `apps/api`
- Build command: `pnpm install && pnpm build`
- Start command: `pnpm start`
- Add all backend env vars including `REDIS_URL` (use Upstash free tier)

---

## Roadmap

- Health summary dashboard with overdue/upcoming alerts
- Push notification support (Web Push API)
- Per-pet expense breakdown and monthly trend view
- Mobile app (React Native)

---

## Author

**Najmul Hasan** — Full Stack Developer  
[GitHub](https://github.com/yourname) · [LinkedIn](https://linkedin.com/in/yourname)

---

## License

MIT
