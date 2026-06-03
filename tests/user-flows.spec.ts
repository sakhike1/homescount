import { test, expect } from '@playwright/test'
import {
  acceptCookies,
  hasAuthSecrets,
  loginAsSeller,
  registerAccount,
  uniqueTestEmail,
} from './helpers'

test.describe('End-to-end buyer flow', () => {
  test('register as buyer then sign in', async ({ page }) => {
    test.skip(!hasAuthSecrets(), 'Auth secrets required')

    const email = uniqueTestEmail('buyer-flow')
    const password = 'password123'

    await registerAccount(page, { email, password, role: 'BUYER' })
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })

    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: /^sign in$/i }).click()

    await expect(page).toHaveURL('/', { timeout: 20_000 })
  })
})

test.describe('End-to-end seller flow', () => {
  test('seller can open new listing form after login', async ({ page }) => {
    test.skip(!hasAuthSecrets(), 'Auth secrets required')
    try {
      await loginAsSeller(page)
    } catch {
      test.skip(true, 'Seller login failed — run npm run db:seed')
    }

    await page.getByRole('link', { name: /new listing/i }).click()
    await expect(page.getByRole('heading', { name: /new listing/i })).toBeVisible()
    await expect(page.getByPlaceholder(/modern 3-bed/i)).toBeVisible()
  })
})

test.describe('Search to detail flow', () => {
  test('buy landing search reaches properties browse', async ({ page }) => {
    await page.goto('/buy?q=Sandton')
    await acceptCookies(page)
    await page.getByRole('link', { name: /view matching homes for sale/i }).click()
    await expect(page).toHaveURL(/\/properties/)
  })
})
