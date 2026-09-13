# LeafClutch Technology

Upskilling platform scaffold: Express + Postgres backend, React (Vite)
frontend. This first milestone covers database bootstrapping plus
signup/login. Khalti payments and SMTP emails are stubbed in `.env.example`
and come next.

## Project structure

```
backend/    Express API, Postgres database, auth routes
frontend/   React (Vite) app — home, signup, login pages
```

## 1. Database

The backend speaks plain Postgres via `pg`, so the same schema and queries
work against a local Postgres instance now and a Supabase project later —
Supabase *is* Postgres, you're just pointing `DATABASE_URL` somewhere else.

**Local Postgres:**
```bash
createdb leaftech
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/leaftech
```

**Supabase, later:** open Project Settings → Database → Connection string →
URI, paste it into `DATABASE_URL`, and set `DATABASE_SSL=true`. No code or
schema changes needed. `backend/src/db/schema.sql` is also plain SQL you can
paste directly into the Supabase SQL editor if you'd rather manage the
schema there instead of letting the app create it on boot.

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # set DATABASE_URL and JWT_SECRET at minimum
npm run dev                # or: npm start
```

On every boot the server:
- creates `users`, `khalti_temp`, `registrations` if they don't exist yet
- leaves `users` and `registrations` untouched
- clears out `khalti_temp`, since it only ever holds in-progress Khalti
  payment attempts (`user_id`, `pidx`, `course`) and shouldn't carry stale
  rows across restarts

Endpoints so far:
- `POST /api/auth/signup` — `{ name, email, phone, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/health`

Validation (enforced on both client and server):
- Email must be a valid `@gmail.com` address
- Phone must be exactly 10 digits (entered after the fixed `+977` prefix)
- Password needs 8+ characters, upper + lower case, a number, and a symbol

## 3. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:5000`, so run the backend
alongside it. Pages: `/` (home), `/signup`, `/login`.

## Database schema

| Table | Purpose |
|---|---|
| `users` | `id, name, email, phone, password (hashed), created_at` |
| `khalti_temp` | `id, user_id, pidx, course, amount, status, created_at` — cleared on every server start |
| `registrations` | `id, user_id, course, pidx, registered_at` — final record once a course purchase completes |

## Next steps

- Khalti payment initiation + verification (`khalti_temp` → `registrations`)
- SMTP confirmation emails on successful registration
- Auth-protected routes / dashboard
