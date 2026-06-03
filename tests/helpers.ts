import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const TEST_USERS = {
  seller: {
    email: process.env.E2E_SELLER_EMAIL ?? 'seller@homescount.com',
    password: process.env.E2E_SELLER_PASSWORD ?? 'password123',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@homescount.com',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'password123',
  },
} as const

/** Dismiss cookie banner so it does not block clicks. */
export async function acceptCookies(page: Page) {
  const banner = page.getByRole('dialog', { name: /cookies/i })
  const visible = await banner.isVisible().catch(() => false)
  if (!visible) return

  const accept = page.getByRole('button', { name: /accept/i }).first()
  if (await accept.isVisible().catch(() => false)) {
    await accept.click()
    await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  }
}

export async function fillCredentials(page: Page, email: string, password: string) {
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
}

export async function loginAsSeller(page: Page) {
  await page.goto('/login?intent=seller')
  await acceptCookies(page)
  await page.getByRole('button', { name: 'Seller', exact: true }).click()
  await fillCredentials(page, TEST_USERS.seller.email, TEST_USERS.seller.password)
  await page.getByRole('button', { name: /sign in to seller portal/i }).click()

  const reachedDashboard = await page
    .waitForURL(/\/dashboard/, { timeout: 45_000 })
    .then(() => true)
    .catch(() => false)

  if (!reachedDashboard) {
    const err = page.getByText(/invalid email or password|registered as/i)
    if (await err.isVisible().catch(() => false)) {
      throw new Error(
        'Seller login failed. Run npm run db:seed and ensure AUTH_SECRET is set in .env'
      )
    }
    throw new Error('Seller login did not redirect to /dashboard')
  }
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await fillCredentials(page, TEST_USERS.admin.email, TEST_USERS.admin.password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30_000 })
}

/** HC logo link in the top navbar (not footer). */
export function navbarLogo(page: Page) {
  return page.getByRole('navigation').getByRole('link', { name: /homescount/i })
}

/** Admin portal sidebar navigation. */
export function adminNav(page: Page) {
  return page.locator('aside nav')
}

export function hasAuthSecrets() {
  return Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)
}

/** Opens the first non-demo listing from browse, or returns false if none found. */
export async function gotoLiveListing(page: Page): Promise<boolean> {
  await page.goto('/properties')
  await acceptCookies(page)
  const cards = page.locator('a[href^="/properties/"]')
  const visible = await cards
    .first()
    .isVisible({ timeout: 20_000 })
    .catch(() => false)
  if (!visible) return false

  const count = await cards.count()
  for (let i = 0; i < Math.min(count, 8); i++) {
    await cards.nth(i).click()
    await expect(page.locator('h1').first()).toBeVisible()
    const isDemo = await page.getByText(/sample listing/i).isVisible().catch(() => false)
    if (!isDemo) return true
    await page.goto('/properties')
    await acceptCookies(page)
  }

  return false
}

/** Unique email for registration tests — avoids collisions across runs. */
export function uniqueTestEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@homescount.test`
}

export async function registerAccount(
  page: Page,
  options: {
    name?: string
    email?: string
    password?: string
    role?: 'BUYER' | 'SELLER'
  } = {}
) {
  const role = options.role ?? 'BUYER'
  const path = role === 'SELLER' ? '/register?role=SELLER' : '/register'

  await page.goto(path)
  await acceptCookies(page)
  await page.locator('form input[type="text"]').fill(options.name ?? 'E2E Test User')
  await page.locator('form input[type="email"]').fill(
    options.email ?? uniqueTestEmail(role.toLowerCase())
  )
  await page.locator('form input[type="password"]').fill(options.password ?? 'password123')
  await page.locator('form select').selectOption(role)
  await page.getByRole('button', { name: /create account/i }).click()
}

export async function gotoFirstBrowseListing(page: Page) {
  await page.goto('/properties')
  await acceptCookies(page)
  const listingLink = page.locator('a[href^="/properties/"]').first()
  await expect(listingLink).toBeVisible({ timeout: 20_000 })
  const href = await listingLink.getAttribute('href')
  expect(href).toMatch(/^\/properties\/[^/]+$/)
  await page.goto(href!)
  await expect(page.locator('h1').first()).toBeVisible()
  return href!
}
