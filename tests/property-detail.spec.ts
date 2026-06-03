import { test, expect } from '@playwright/test'
import { acceptCookies, gotoFirstBrowseListing } from './helpers'

test.describe('Property detail page', () => {
  test('opens a listing from browse results', async ({ page }) => {
    await gotoFirstBrowseListing(page)
    await expect(page.getByText(/R\s|\/mo|bedroom|bathroom/i).first()).toBeVisible()
    await expect(page.locator('input[type="email"], form').first()).toBeVisible()
  })

  test('shows seller card and contact section', async ({ page }) => {
    await gotoFirstBrowseListing(page)
    await expect(page.getByText(/listed by/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: /message/i })).toBeVisible()
  })

  test('back navigation returns to properties browse', async ({ page }) => {
    await gotoFirstBrowseListing(page)
    await page.getByRole('link', { name: /back to|all properties/i }).first().click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('displays property specs grid', async ({ page }) => {
    await gotoFirstBrowseListing(page)
    await expect(page.getByText(/bedrooms|bathrooms|floor size|garage/i).first()).toBeVisible()
  })
})
