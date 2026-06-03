import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Property browse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)
  })

  test('shows listing cards or empty state', async ({ page }) => {
    const cards = page.locator('a[href^="/properties/"]')
    const empty = page.getByText(/no published|check back soon|sample/i)
    await expect(cards.first().or(empty.first())).toBeVisible({ timeout: 20_000 })
  })

  test('search by suburb updates URL', async ({ page }) => {
    await page.locator('input[name="suburb"]').fill('Sandton')
    await page.getByRole('button', { name: /search properties/i }).click()
    await expect(page).toHaveURL(/suburb=Sandton/i)
  })

  test('all type tab clears buy/rent filter', async ({ page }) => {
    await page.goto('/properties?type=buy')
    await acceptCookies(page)
    await page.locator('label:has(input[value="all"])').click()
    await expect(page).not.toHaveURL(/type=buy/)
  })

  test('property detail back link returns to browse', async ({ page }) => {
    const listingLink = page.locator('a[href^="/properties/"]').first()
    await expect(listingLink).toBeVisible({ timeout: 20_000 })
    await listingLink.click()
    await expect(page.locator('h1').first()).toBeVisible()

    const backLink = page.getByRole('link', { name: /back to|all properties/i }).first()
    await backLink.click()
    await expect(page).toHaveURL(/\/properties/)
  })
})
