# Official Editorial CMS & Admin Portal — Hon. Queenstar Maame Pokua Sawyerr

Official Content Secretariat & Constituent Portal for **Hon. Queenstar Maame Pokua Sawyerr (Member of Parliament, Agona East Constituency)**. Built to share a single PostgreSQL / Supabase database and Storage bucket (`media`) with the public website (`hon-sawyer`).

---

## Repository Layout

- `supabase/schema.sql` — Shared PostgreSQL schema, triggers, indexes, Row Level Security (RLS) policies, and `media` Storage bucket configuration.
- `supabase/seed.sql` — Complete initial seed dataset mirroring `hon-sawyer/src/data/mockData.ts`, `Hero.tsx`, and sample inquiries/subscribers.
- `admin-hon-sawyer/` — Vite + React + TypeScript Editorial CMS web application.

---

## 1. Shared Supabase Setup

1. Open your Supabase project's **SQL Editor**.
2. Run [`supabase/schema.sql`](supabase/schema.sql) once.
3. Run [`supabase/seed.sql`](supabase/seed.sql) once to populate all initial sections with zero blank states.
4. Create your Secretariat staff account(s) in **Authentication → Users**, then grant staff clearance using **either** method:
   - Insert the staff member into `public.secretariat_staff`:
     ```sql
     insert into public.secretariat_staff (email, full_name, role)
     values ('communications@honpokuasawyerr.org', 'Communications Director', 'admin');
     ```
   - Or set `app_metadata.role` (`'admin'`, `'secretariat'`, or `'editor'`) on the user in `auth.users`.

---

## 2. Running the Admin Portal

```bash
cd admin-hon-sawyer
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

If `.env` is not configured yet, the sign-in screen offers a **Local Secretariat Preview** mode backed by `localStorage` and pre-seeded with the full Agona East dataset so you can inspect and test every section immediately.
