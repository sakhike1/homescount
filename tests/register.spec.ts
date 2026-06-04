import { test, expect } from '@playwright/test'
import { acceptCookies, registerAccount, TEST_USERS } from './helpers'

test.describe('Registration', () => {
  test('buyer registration redirects to login', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET, 'Auth secrets required')
    await registerAccount(page, { role: 'BUYER' })
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })
  })

  test('seller registration redirects to seller login', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET, 'Auth secrets required')
    await registerAccount(page, { role: 'SELLER' })
    await expect(page).toHaveURL(/\/login\?intent=seller/, { timeout: 15_000 })
  })

  test('register?role=SELLER pre-selects seller role', async ({ page }) => {
    await page.goto('/register?role=SELLER')
    await acceptCookies(page)
    await expect(page.locator('form select')).toHaveValue('SELLER')
  })

  test('duplicate email shows error', async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET, 'Auth secrets required')
    await registerAccount(page, {
      email: TEST_USERS.seller.email,
      password: TEST_USERS.seller.password,
      role: 'BUYER',
    })
    await expect(page.getByText(/user already exists/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('sign in link from register works', async ({ page }) => {
    await page.goto('/register')
    await acceptCookies(page)
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/login')
  })

  test('shows Homescout logo on register page', async ({ page }) => {
    await page.goto('/register')
    await acceptCookies(page)
    await expect(page.getByRole('link', { name: /Homescout/i }).first()).toBeVisible()
  })
})
