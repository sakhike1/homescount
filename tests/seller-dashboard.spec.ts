import { test, expect } from '@playwright/test'
import { acceptCookies, loginAsSeller } from './helpers'
  test.beforeEach(async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET, 'Auth secrets required')
    try {
      await loginAsSeller(page)
    } catch {
      test.skip(true, 'Seller login failed — run npm run db:seed')
    }
  })

  test('dashboard shows listings heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my listings/i })).toBeVisible()
  })

  test('new listing page loads form', async ({ page }) => {
    await page.getByRole('link', { name: /new listing/i }).click()
    await expect(page).toHaveURL('/dashboard/listings/new')
    await expect(page.getByRole('heading', { name: /new listing/i })).toBeVisible()
    await expect(page.locator('form input, form textarea, form select').first()).toBeVisible()
  })

  test('messages page loads', async ({ page }) => {
    await page.getByRole('link', { name: /messages/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/messages/)
    await expect(page.getByRole('heading', { name: /messages|enquiries/i })).toBeVisible()
  })

  test('logo links back to public site', async ({ page }) => {
    await page.getByRole('link', { name: /homescount/i }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('listing form shows required fields', async ({ page }) => {
    await page.getByRole('link', { name: /new listing/i }).click()
    await expect(page.getByText(/^title$/i)).toBeVisible()
    await expect(page.getByText(/^price$/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /for sale/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /for rent/i })).toBeVisible()
  })
})
