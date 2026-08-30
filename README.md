# Azam Homes

A role-based real estate listings platform built with React. Managers post available
spaces; admins review and approve them before they appear publicly.

## Tech stack

- **React** (Vite) — UI and component structure
- **React Router** — client-side routing and protected routes
- **Tailwind CSS** — styling
- **lucide-react** — icon set
- **React Context + localStorage** — auth, listings, and messages state (no backend yet)

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Project structure

```
frontend/
├── src/
│   ├── assets/              # images (e.g. hero.jpeg)
│   ├── components/
│   │   └── BottomNav.jsx    # shared bottom navigation, role-aware
│   ├── context/
│   │   ├── AuthContext.jsx      # signup/login/logout, persisted to localStorage
│   │   ├── ListingsContext.jsx  # listings CRUD, persisted to localStorage
│   │   └── AlertsContext.jsx    # admin → manager messages, persisted to localStorage
│   ├── pages/
│   │   ├── Landing.jsx      # public marketing page
│   │   ├── Login.jsx
│   │   ├── Signup.jsx       # role picker: manager (+building) or admin
│   │   ├── Feed.jsx         # public feed of approved listings, search + category filter
│   │   ├── ManagerView.jsx  # manager's own listings + stats
│   │   ├── AdminView.jsx    # pending listings, approve/reject
│   │   ├── CreateFeed.jsx   # manager: post a new listing
│   │   ├── CreateAlert.jsx  # admin: send a message to managers
│   │   ├── Messages.jsx     # inbox of messages
│   │   └── Profile.jsx      # account info, stats, settings, logout
│   ├── routes/
│   │   └── ProtectedRoute.jsx   # redirects if not logged in / wrong role
│   ├── App.jsx               # route definitions, context providers
│   └── main.jsx
```

## How auth works

`AuthContext` stores two things in `localStorage`:

- `azam_users` — every account ever signed up (name, email, phone, building, password, role)
- `azam_user` — whichever account is currently logged in

`signup(data)` rejects duplicate emails and logs the new user in immediately.
`login(email, password)` checks credentials against `azam_users`.
`ProtectedRoute` reads the current user from context and redirects to `/login` (if
logged out) or `/` (if logged in but wrong role) before rendering `/manager` or `/admin`.

**This is a demo auth system.** Passwords are stored in plain text in localStorage —
fine for a portfolio project, not for production. A real deployment needs a backend
with hashed passwords and server-side sessions.

## How listings work

`ListingsContext` holds an array of listings in `localStorage` (`azam_listings`), each
with a `status` of `pending`, `approved`, or `rejected`.

| Action               | Who                        | Effect                                            |
| -------------------- | -------------------------- | ------------------------------------------------- |
| `addListing(data)`   | Manager, via `CreateFeed`  | New listing added with `status: 'pending'`        |
| `approveListing(id)` | Admin, via `AdminView`     | Sets `status: 'approved'` → now visible in `Feed` |
| `rejectListing(id)`  | Admin, via `AdminView`     | Sets `status: 'rejected'`                         |
| `deleteListing(id)`  | Manager, via `ManagerView` | Removes it entirely (with a confirm prompt)       |

`Feed` only shows `approved` listings. `ManagerView` shows listings filtered to the
logged-in manager's name. `AdminView` shows all `pending` listings across every manager.

## Responsiveness

Every page uses Tailwind's mobile-first breakpoints — base styles target the smallest
screen, with `sm:` (≥640px) and `md:` (≥768px) overrides layered on top. A few examples:

- **Feed grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — 1 column on phones, up to
  3 on desktop.
- **Auth cards** (`Login`, `Signup`): `flex-col md:flex-row` — the branded panel stacks
  above the form on mobile, sits beside it on desktop.
- **Spacing/type**: paddings and font sizes step up at each breakpoint
  (e.g. `px-5 sm:px-8`, `text-3xl sm:text-4xl md:text-5xl`) rather than staying fixed.
- **Bottom navigation** is `fixed` and full-width at every size, so it stays usable on
  a phone-sized viewport without extra work.

To sanity-check it yourself: open the app, then resize the browser window (or use your
browser's device toolbar) — the property grid should reflow, the auth panels should
restack, and the bottom nav should stay pinned and legible throughout.

## Known limitations / next steps

- **No real backend.** All data lives in the browser's `localStorage`. Clearing browser
  data wipes everything; nothing is shared across devices or browsers.
- **No image upload.** The "upload photos" control in `CreateFeed` is UI only —
  listings always use a placeholder image.
- **Search is location-only.** No price range, bedroom count, or sort options yet.
- **No pagination.** Fine for demo data, would need it for a real listing volume.
- **Passwords are stored in plain text.** Do not reuse a real password when testing.

The natural next step is a Flask + PostgreSQL backend (the stack this project was
originally scoped for) — swapping the Context `localStorage` calls for API requests
without changing how the pages consume the data.
