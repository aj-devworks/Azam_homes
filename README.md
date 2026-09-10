# Azam Homes

A real estate rental listings platform for Nairobi, Kenya. Managers post
listings, an admin reviews and approves them, and approved listings appear
on the public feed for renters to browse.

**Live site:** https://azam-homes.vercel.app

## Project structure

```
Azam-homes/
  frontend/          React app (Vite) — the site itself
    backend/         Flask + PostgreSQL API
```

## Stack

- **Frontend:** React, Vite, Tailwind CSS — deployed on [Vercel](https://vercel.com)
- **Backend:** Python, Flask, SQLAlchemy — deployed on [Render](https://render.com)
- **Database:** PostgreSQL — hosted on [Supabase](https://supabase.com)
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing
- **Uptime:** [UptimeRobot](https://uptimerobot.com) heartbeat keeps the free-tier backend and database from sleeping

## How it works

1. A visitor signs up → always becomes a **manager** account (no public admin signup)
2. A manager creates a listing → status starts as `pending`
3. The **admin** reviews pending listings in the dashboard → approves or rejects
4. Approved listings appear on the public feed
5. Admin can also view manager contact details, ban/unban, reset passwords, or delete manager accounts

## Setup

See the individual READMEs for local development instructions:
- [`frontend/README.md`](./frontend/README.md) — running the React app
- [`frontend/backend/README.md`](./frontend/backend/README.md) — running the API and database

## Deployment

- **Frontend:** auto-deploys to Vercel on push to `main`
- **Backend:** auto-deploys to Render on push to `main`
- **Database:** Supabase (Session Pooler connection — required for IPv4 networks)

Environment variables for both are set directly in each platform's dashboard
(Vercel → Settings → Environment Variables; Render → Environment tab) — not
committed to the repo.
# Azam Homes — Frontend

React (Vite) frontend for Azam Homes. Talks to the Flask backend in
[`backend/`](./backend) via the API client in `src/services/api.js`.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local — set VITE_API_BASE_URL to your backend's URL
npm run dev
```

Local dev expects the backend running at `http://127.0.0.1:5000` by default
(see `backend/README.md`).

## Project structure

```
src/
  pages/            Route-level pages (Login, Signup, Feed, AdminView, ManagerView, ...)
  components/       Shared UI pieces (Navbar, BottomNav, propertyCard)
  context/          React context: AuthContext, ListingsContext, AlertsContext
  routes/           ProtectedRoute (role-gated routing)
  services/api.js   Central fetch client — attaches JWT, auto-refreshes on 401
```

## Roles

- **Manager** — signs up publicly, creates listings, sees their own submissions
- **Admin** — approves/rejects listings, manages manager accounts (ban, delete,
  reset password), can view manager contact details on any listing

Only one way exists to create an admin: an existing admin calling
`/api/auth/register`. Public signup always creates managers.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://127.0.0.1:5000/api` or `https://azam-homes.onrender.com/api` |

## Build

```bash
npm run build
```

Deployed automatically to Vercel on push to `main`.
