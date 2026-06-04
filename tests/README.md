# End-to-end tests (Playwright)

## Prerequisites

- PostgreSQL with schema applied (`npm run db:push`)
- Seed data: `npm run db:seed` (seller & admin: `password123`)
- `AUTH_SECRET` and `NEXTAUTH_SECRET` in `.env`

## Run tests

Playwright starts a dev server automatically (unless you reuse an existing one):

```bash
npm run db:seed

# Full suite — Chromium only (recommended locally)
npm run test:e2e:chromium

# Quick smoke — public pages, nav, auth, branding
npm run test:e2e:smoke

# All browsers
npm run test:e2e

# Interactive UI
npm run test:e2e:ui
```

Reuse an already-running dev server:

```powershell
$env:PW_REUSE_SERVER='1'
npm run test:e2e:chromium
```

## Test files

| File | What it covers |
|------|----------------|
| `public-pages.spec.ts` | All public routes load |
| `navigation.spec.ts` | Navbar links, sign in |
| `home-search.spec.ts` | Home hero search tabs & area chips |
| `landing-ctas.spec.ts` | Footer CTAs on buy/rent/sell |
| `landing-heroes.spec.ts` | Hero action cards, cross-page nav |
| `property-browse.spec.ts` | Filters, listing cards, back links |
| `property-detail.spec.ts` | Detail layout, specs, seller card |
| `property-enquiry.spec.ts` | Contact form & POPIA consent |
| `auth.spec.ts` | Login, protected routes, seller/admin |
| `register.spec.ts` | Sign up, duplicate email, roles |
| `user-flows.spec.ts` | Register→login, search→browse |
| `seller-dashboard.spec.ts` | Listings, messages, new listing form |
| `admin-portal.spec.ts` | Admin overview, activity, users, sellers |
| `newsletter.spec.ts` | Home newsletter signup & consent |
| `mobile-nav.spec.ts` | Mobile menu (390px viewport) |
| `page-metadata.spec.ts` | Document titles, favicon |
| `journeys.spec.ts` | Buy/rent/sell journey sections |
| `legal-and-consent.spec.ts` | Privacy/terms/cookies, cookie banner |
| `branding.spec.ts` | HS logo in navbar and Homescout wordmark in footer |

Auth and database tests **skip** automatically when secrets or seed data are missing.
