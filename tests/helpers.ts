import type { Page } from '@playwright/test'

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
