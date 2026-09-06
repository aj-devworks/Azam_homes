# Azam Homes — Backend

Python/Flask + PostgreSQL API for the Azam Homes real estate site (the React
frontend at azam-homes.vercel.app). Role-based access for `admin` and
`manager` accounts.

## Security features

- **Passwords**: bcrypt hashing (never stored in plain text), strength rule
  enforced server-side (10+ chars, upper/lower/digit/symbol).
- **Auth**: short-lived JWT access tokens (15 min) + refresh tokens (7 days),
  with a revocation blocklist so logout actually invalidates a token.
- **Account lockout**: 5 failed logins locks the account for 15 minutes.
  Login errors are generic ("Invalid email or password") so attackers can't
  enumerate which emails exist.
- **RBAC**: every write route is wrapped in `@roles_required(...)`. Managers
  can only edit/delete their own listings; admins can touch anything.
  Creating new accounts requires an existing admin — there's no public
  self-signup, since this is an internal management tool.
- **Rate limiting**: login is capped (10/min/IP) to slow down credential
  stuffing.
- **Input validation**: every request body is validated with marshmallow
  schemas before it touches the database — rejects malformed types, bad
  emails, negative prices, unknown enum values, etc.
- **SQL injection**: all queries go through SQLAlchemy's ORM/parameter
  binding — no raw string-built SQL anywhere.
- **Security headers**: Flask-Talisman sets CSP, HSTS, and forces HTTPS in
  production.
- **CORS**: locked to an explicit origin allow-list from `CORS_ORIGINS` —
  never `*`.
- **Secrets**: `SECRET_KEY` / `JWT_SECRET_KEY` / `DATABASE_URL` are required
  environment variables — the app refuses to start without them, so nothing
  is hardcoded.
- **Error handling**: 500s are logged server-side but never leak stack
  traces or internals to the client.

## Project layout

```
azam_homes_backend/
  app/
    __init__.py        # app factory, security wiring, error handlers
    config.py           # env-driven config, dev/prod split
    extensions.py        # db, jwt, cors, limiter, talisman singletons
    schemas.py           # marshmallow request validation
    models/
      user.py            # User + Role, password hashing/lockout
      property.py         # Property + PropertyImage
      token_blocklist.py   # revoked JWTs (logout)
    routes/
      auth.py             # register/login/refresh/logout/me
      properties.py        # public browse + role-gated CRUD
      users.py             # admin: list/activate/deactivate users
    utils/
      decorators.py        # @roles_required, @admin_required
  seed_admin.py          # one-time: create the first admin account
  run.py                 # entrypoint
  requirements.txt
  .env.example            # copy to .env and fill in real secrets
```

## Local setup

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env: set real SECRET_KEY/JWT_SECRET_KEY (e.g. `python3 -c "import secrets; print(secrets.token_hex(32))"`),
# your Postgres DATABASE_URL, and CORS_ORIGINS.

# create the database, e.g.:
createdb azam_homes

# create tables
flask --app run db init      # first time only
flask --app run db migrate -m "initial schema"
flask --app run db upgrade

# create the first admin account (reads ADMIN_EMAIL/ADMIN_PASSWORD from .env)
python seed_admin.py

# run
flask --app run run --debug   # dev
# or: gunicorn -w 4 -b 0.0.0.0:5000 run:app   # production
```

## API overview

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | — | rate-limited |
| POST | `/api/auth/register` | admin | creates admin or manager accounts |
| POST | `/api/auth/refresh` | refresh token | issues new access token |
| POST | `/api/auth/logout` | any token | revokes the token |
| GET | `/api/auth/me` | any token | current user |
| GET | `/api/properties` | — | public, filterable, paginated |
| GET | `/api/properties/<id>` | — | public |
| POST | `/api/properties` | admin/manager | create listing |
| PATCH | `/api/properties/<id>` | admin, or owning manager | update listing |
| DELETE | `/api/properties/<id>` | admin, or owning manager | delete listing |
| GET | `/api/users` | admin | list accounts |
| PATCH | `/api/users/<id>/deactivate` | admin | disable a login |
| PATCH | `/api/users/<id>/activate` | admin | re-enable a login |

All authenticated routes expect `Authorization: Bearer <access_token>`.

## Connecting the React frontend

In the frontend, replace mock data calls with fetches to this API, sending
the JWT in the `Authorization` header, and store `CORS_ORIGINS` in this
backend's `.env` to match wherever the frontend is deployed
(`https://azam-homes.vercel.app` is already included).

## Suggested hosting

Render, Railway, or Fly.io all give you a managed Postgres instance plus a
place to run gunicorn cheaply — a natural pairing with Vercel for the
frontend. Set the same environment variables from `.env.example` in
whichever platform's dashboard.
