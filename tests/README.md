# End-to-end tests (Playwright)

## Prerequisites

- PostgreSQL running with schema applied (`npm run db:push`)
- Seed data for auth tests: `npm run db:seed` (seller & admin use `password123` by default)

## Run tests

Stop any existing `npm run dev` process first so Playwright starts a fresh server with your `.env` loaded.

```bash
npm run db:seed   # required for login tests

# All browsers (Chromium, Firefox, WebKit) — starts dev server automatically
npm run test:e2e

# Chromium only (faster)
npm run test:e2e:chromium

# Interactive UI
npm run test:e2e:ui

# HTML report after a run
npm run test:e2e:report
```

## Optional env overrides

```env
E2E_SELLER_EMAIL=seller@homescount.com
E2E_SELLER_PASSWORD=password123
E2E_ADMIN_EMAIL=admin@homescount.com
E2E_ADMIN_PASSWORD=password123
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

## What is covered

- Public routes (home, buy, rent, sell, properties, login, register, legal, admin login)
- Navigation and landing CTAs
- Cookie consent and legal footer links
- Property browse filters and demo listing pages
- Seller/admin login and protected route redirects
