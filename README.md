# FlexCore — Gym Management SaaS

A full-stack gym management application built with React (Vite + Tailwind v4) and Node/Express + MongoDB.

## Project structure

```
gym-management/
  server/   Express API (auth, members, plans, payments, trainers, dashboard)
  client/   React app (Vite, Tailwind, Recharts)
```

## Features implemented in this scaffold

- **Auth**: JWT login/register, role-based middleware (admin/manager/staff)
- **Dashboard**: stat cards (members, active, expired, trainers, revenue, attendance, pending payments), revenue trend chart, plan distribution donut, recent activity feed, quick actions
- **Members**: CRUD, search/filter/pagination, QR-code membership card (generated server-side with `qrcode`), membership renewal endpoint, expiry status auto-computed (`Active` / `Expiring Soon` / `Expired`)
- **Membership Plans**: CRUD for Daily/Weekly/Monthly/Quarterly/Half-Yearly/Annual/Premium/VIP tiers with pricing, duration, and benefits
- **Payments**: collect fees, payment history with pagination, PDF invoice generation/download (`pdfkit`)
- **Trainers**: CRUD with specialization tags
- **Cron job**: daily membership status refresh (hook point for email/SMS expiry reminders)

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed            # creates admin@gym.com / admin123 + sample plans
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173, proxies /api to :5000
```

Login with the seeded admin account: **admin@gym.com / admin123**.

## Design system

- Sidebar: near-black (`--color-sidebar`) with a volt-green (`--color-volt`) active accent — a deliberate energetic contrast to the generic indigo SaaS look.
- Type: Space Grotesk (display/headings) + Inter (body) + JetBrains Mono (stat figures, IDs, invoice numbers) for a data-forward analytics feel.
- All design tokens live in `client/src/index.css` under `@theme` (Tailwind v4 CSS-first config) — change colors/fonts there to re-theme the whole app.

## What's next (not yet built, natural follow-ups)

- Attendance check-in via QR scan (camera) screen
- Email/SMS sending wired into the cron job (`server/utils/reminderCron.js`)
- File upload (member/trainer photos) via Cloudinary — model fields already exist
- Role-aware UI (hide delete buttons for `staff` role)
- Member detail/profile page with full membership history timeline
