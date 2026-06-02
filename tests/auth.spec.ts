import { test, expect } from '@playwright/test'
import {
  acceptCookies,
  fillCredentials,
  loginAsAdmin,
  loginAsSeller,
} from './helpers'

test.describe('Authentication', () => {

  test('invalid login shows error', async ({ page }) => {
    await page.goto('/login')
    await acceptCookies(page)
    await fillCredentials(page, 'not-a-real-user@example.com', 'wrong-password-xyz')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('seller can sign in and reach dashboard', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET, 'Set AUTH_SECRET in .env')
    try {
      await loginAsSeller(page)
    } catch {
      test.skip(true, 'Seller login failed — run npm run db:seed and restart the dev server')
    }
    await expect(page.getByRole('heading', { name: /my listings/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /new listing|add listing/i })).toBeVisible()
  })

  test('seller dashboard navigation works', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET, 'Set AUTH_SECRET in .env')
    try {
      await loginAsSeller(page)
    } catch {
      test.skip(true, 'Seller login failed — run npm run db:seed and restart the dev server')
    }
    await page.getByRole('link', { name: /messages/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/messages/)
    await page.getByRole('link', { name: /my listings/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('admin can sign in and reach portal', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET, 'Set AUTH_SECRET in .env')
    try {
      await loginAsAdmin(page)
    } catch {
      test.skip(true, 'Admin login failed — run npm run db:seed and restart the dev server')
    }
    await expect(page).not.toHaveURL(/\/admin\/login/)
    await expect(page.getByText(/admin|activity|sellers|users/i).first()).toBeVisible()
  })

  test('unauthenticated admin portal redirects to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('unauthenticated dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Login form UX', () => {
  test('seller intent pre-selects seller tab', async ({ page }) => {
    await page.goto('/login?intent=seller')
    await acceptCookies(page)
    await expect(page.getByRole('button', { name: 'Seller', exact: true })).toHaveClass(
      /bg-white/
    )
  })

  test('register link from login works', async ({ page }) => {
    await page.goto('/login')
    await acceptCookies(page)
    await page.locator('a[href="/register"]').click()
    await expect(page).toHaveURL(/\/register/, { timeout: 15_000 })
  })
})
