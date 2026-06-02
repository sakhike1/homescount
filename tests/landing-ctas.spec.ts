import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Landing page CTAs', () => {
  test('buy page footer CTA links to properties', async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
    await page.getByRole('link', { name: /search homes for sale/i }).click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('rent page footer CTA links to rentals browse', async ({ page }) => {
    await page.goto('/rent')
    await acceptCookies(page)
    await page.getByRole('link', { name: /search all rentals/i }).click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('sell page footer CTA links to seller registration', async ({ page }) => {
    await page.goto('/sell')
    await acceptCookies(page)
    await page.getByRole('link', { name: /register as seller/i }).click()
    await expect(page).toHaveURL(/\/register\?role=SELLER/)
  })
})
