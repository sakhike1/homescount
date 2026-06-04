import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Buyer and seller journeys', () => {
  test('buy page shows journey steps', async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
    await expect(page.getByText(/why buy with Homescout/i)).toBeVisible()
    await expect(page.getByText(/viewing|enquiry|transfer|deeds/i).first()).toBeVisible()
  })

  test('rent page shows journey steps', async ({ page }) => {
    await page.goto('/rent')
    await acceptCookies(page)
    await expect(page.getByText(/why rent with Homescout/i)).toBeVisible()
    await expect(page.getByText(/move-in|enquiry|viewing/i).first()).toBeVisible()
  })

  test('sell page shows listing journey', async ({ page }) => {
    await page.goto('/sell')
    await acceptCookies(page)
    await expect(page.getByText(/why list on Homescout/i)).toBeVisible()
    await expect(page.getByText(/how to list your property/i)).toBeVisible()
  })

  test('property detail shows journey guide', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)
    const listingLink = page.locator('a[href^="/properties/"]').first()
    await expect(listingLink).toBeVisible({ timeout: 20_000 })
    await listingLink.click()
    await expect(page.getByText(/Homescout will help you through every step/i)).toBeVisible()
  })
})
