# Azam Homes — Backend

Python/Flask + PostgreSQL API for Azam Homes. Role-based access for `admin`
and `manager` accounts, JWT auth, and a manager-submits/admin-approves
listing workflow.

**Live API:** https://azam-homes.onrender.com/api

## Security features

- Passwords hashed with bcrypt (min 4 characters — deliberately relaxed for this project)
- JWT access (15 min) + refresh (7 day) tokens, with a revocation blocklist on logout
- Account lockout after 5 failed logins (15 min)
- RBAC on every write route — managers can only edit/delete their own listings
- Phone numbers validated (`07XXXXXXXX` or `+2547XXXXXXXX`) and unique per manager
- Admin-only account creation for new admins — no public admin signup
- CORS locked to an explicit origin allow-list (no wildcard)
- Rate-limited login endpoint

## Local setup

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# fill in real SECRET_KEY / JWT_SECRET_KEY, DATABASE_URL, CORS_ORIGINS

flask --app run db upgrade
python seed_admin.py   # creates the first admin, from ADMIN_EMAIL/ADMIN_PASSWORD in .env

flask --app run run --debug
```

### Database connection (Supabase)

If using Supabase on a network without IPv6 support, use the **Session
Pooler** connection string (port `5432`, host like
`aws-<region>.pooler.supabase.com`), not the direct connection — the direct
host only resolves over IPv6 and will fail with "Network is unreachable" on
most home/ISP networks.

## Project layout

```
app/
  __init__.py        App factory, security wiring, error handlers
  config.py           Env-driven config
  extensions.py         db, jwt, cors, limiter, talisman singletons
  schemas.py             Marshmallow request validation
  models/                 User, Property, PropertyImage, TokenBlocklist
  routes/
    auth.py               register / signup / login / refresh / logout / me
    properties.py           public browse + role-gated CRUD + approve/reject
    users.py                 admin: list / activate / deactivate / delete /
                              reset-password + public admin-contact
  utils/decorators.py     @roles_required, @admin_required
seed_admin.py          One-time first-admin bootstrap
run.py                 Entrypoint
```

## Key API routes

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/signup` | — | public, always creates a manager |
| POST | `/api/auth/login` | — | rate-limited |
| POST | `/api/auth/register` | admin | create account of any role |
| GET | `/api/auth/me` | any | current user |
| GET | `/api/properties` | — | public, filterable, paginated |
| POST | `/api/properties` | admin/manager | create listing (status: pending) |
| PATCH | `/api/properties/<id>/approve` | admin | |
| PATCH | `/api/properties/<id>/reject` | admin | |
| GET | `/api/users` | admin | list all accounts |
| GET | `/api/users/admin-contact` | — | public — admin's name/email/phone |
| PATCH | `/api/users/<id>/deactivate` | admin | ban (blocks login, keeps data) |
| PATCH | `/api/users/<id>/reset-password` | admin | set a new password directly |
| DELETE | `/api/users/<id>` | admin | permanent — cascades to their listings |

## Deployment (Render)

- **Runtime:** Python 3.12 (pin via `PYTHON_VERSION` env var or `runtime.txt` — newer versions break `psycopg2-binary`)
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `gunicorn run:app`
- Environment variables set in Render's dashboard, matching `.env.example`
- Run `flask --app run db upgrade` in Render's Shell tab after schema changes
