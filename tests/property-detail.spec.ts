import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Property detail', () => {
  test('opens a listing from browse results', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)

    const listingLink = page.locator('a[href^="/properties/"]').first()
    await expect(listingLink).toBeVisible({ timeout: 20_000 })
    const href = await listingLink.getAttribute('href')
    expect(href).toMatch(/^\/properties\/[^/]+$/)

    await page.goto(href!)

    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByText(/R\s|\/mo|bedroom|bathroom/i).first()).toBeVisible()
    await expect(page.locator('input[type="email"], form').first()).toBeVisible()
  })
})
