import { test, expect } from '@playwright/test'
import { acceptCookies, hasAuthSecrets, uniqueTestEmail } from './helpers'

test.describe('Newsletter signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
  })

  test('newsletter form is visible on home page', async ({ page }) => {
    await expect(page.locator('#footer-newsletter-email')).toBeVisible()
    await expect(page.getByRole('button', { name: /^subscribe$/i })).toBeVisible()
  })

  test('requires privacy consent before subscribing', async ({ page }) => {
    await page.locator('#footer-newsletter-email').fill(uniqueTestEmail('newsletter'))
    await page.getByRole('button', { name: /^subscribe$/i }).click()
    await expect(page.getByText(/privacy policy/i)).toBeVisible()
  })

  test('successful subscription shows thank you message', async ({ page }) => {
    test.skip(!hasAuthSecrets(), 'Database required for newsletter API')

    await page.locator('#footer-newsletter-email').fill(uniqueTestEmail('newsletter'))
    await page.locator('#footer-newsletter-privacy-consent').check()
    await page.getByRole('button', { name: /^subscribe$/i }).click()

    await expect(page.getByText(/thanks.*on the list/i)).toBeVisible({
      timeout: 15_000,
    })
  })
})
