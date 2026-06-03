# Deploy Homescount to Netlify (interview demo)

Your app is **not static HTML** — it needs a **hosted PostgreSQL database** and **environment variables** for auth. Netlify can run Next.js API routes and server actions, but the database cannot live on your laptop once the site is public.

## What works on Netlify vs local

| Feature | Works if you… |
|--------|----------------|
| Browse pages, buy/rent/sell landings | Yes (demo listings show if DB empty) |
| **Register / login** | Need `DATABASE_URL` + `AUTH_SECRET` + `NEXTAUTH_URL` |
| Seller dashboard, enquiries | Need seeded or real data in hosted DB |
| **Upload new photos** | Limited — files save to server disk and **do not persist** on Netlify. Use pre-seeded listings for demos. |

## Step 1 — Hosted database (free tier)

Pick one:

- [Neon](https://neon.tech) (recommended, easy Prisma + Netlify)
- [Supabase](https://supabase.com) → Project Settings → Database → connection string
- [Railway](https://railway.app)

1. Create a PostgreSQL database.
2. Copy the connection string (for Neon, prefer the **pooled** connection URL for serverless).
3. Ensure it includes SSL, e.g. `?sslmode=require`.

## Step 2 — Prepare the database (from your PC)

With `DATABASE_URL` set to the **hosted** URL (temporarily in `.env`):

```bash
npm run db:push
npm run db:seed
```

This creates tables and demo users:

- Seller: `seller@homescount.com` / `password123`
- Admin: `admin@homescount.com` / `password123` → `/admin/login`

**Before a public interview link:** change these passwords in the seed or create new users via Register.

## Step 3 — Push code to GitHub

Netlify deploys from Git. Ensure `.env` is **not** committed (it should be in `.gitignore`).

## Step 4 — Create Netlify site

1. [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git**.
2. Select your repo.
3. Build settings (must match `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (do **not** leave blank — Netlify may default to repo root and fail)
4. **Site settings → Environment variables** — add (scope: **All** — build + runtime):

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Your hosted Postgres URL (same as local `.env`) |
| `AUTH_SECRET` | Long random string (32+ chars) |
| `NEXTAUTH_SECRET` | Same as `AUTH_SECRET` (optional duplicate) |
| `NEXTAUTH_URL` | `https://YOUR-SITE-NAME.netlify.app` |
| `AUTH_URL` | Same as `NEXTAUTH_URL` (NextAuth v5) |
| `NEXT_PUBLIC_SITE_URL` | Same as `NEXTAUTH_URL` — used for canonical URLs, Open Graph, and `sitemap.xml` |
| `NODE_VERSION` | `20` (optional; also in `netlify.toml`) |

5. Deploy. If the build fails, open the deploy log — often missing `DATABASE_URL` during build if a page queries the DB at build time.

## Step 5 — Verify after deploy

- [ ] Home and `/properties` load
- [ ] `/robots.txt` and `/sitemap.xml` return 200 (SEO)
- [ ] `/register` → create account → `/login`
- [ ] Login as seller → `/dashboard`
- [ ] Open a listing → send enquiry (needs published listing from seed)
- [ ] Admin: `/admin/login` (do not advertise this URL in the interview)

## Interview tips

1. **Seed data** — You’ll have 18 sample listings; browsing looks full immediately.
2. **Do not rely on image upload** on Netlify for the demo; show listings that already have photos.
3. **Tell the interviewer** you’d use S3/Cloudinary for production uploads and connection pooling for Postgres.
4. **Optional:** Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` only if you want analytics (cookie banner already handles consent).

## Troubleshooting

**Login always fails**

- `NEXTAUTH_URL` must match the live URL exactly (https, no trailing slash).
- Redeploy after changing env vars.
- Confirm `AUTH_SECRET` is set.

**Build fails on Prisma / `ECONNREFUSED` on `/admin/*`**

- Add `DATABASE_URL` in Netlify env vars (available at **build** and **runtime**).
- Admin and seller dashboard routes are dynamic; if an older deploy still fails, pull latest `netlify.toml` and redeploy with cache cleared.

**Works locally, empty on Netlify**

- Local `.env` is not uploaded — every secret must be in Netlify env vars.

## Alternative

[Vercel](https://vercel.com) is also a strong fit for Next.js + Prisma and similar steps apply. Choose one platform for the interview demo.
