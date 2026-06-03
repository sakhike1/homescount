import { test, expect } from '@playwright/test'
import { acceptCookies, gotoLiveListing, hasAuthSecrets } from './helpers'

test.describe('Property enquiry', () => {
  test('live listing enquiry form can be submitted', async ({ page }) => {
    test.skip(!hasAuthSecrets(), 'Auth secrets required')
    const found = await gotoLiveListing(page)
    test.skip(!found, 'No live listings — run npm run db:seed')

    await page.getByPlaceholder(/your name/i).fill('Test Buyer')
    await page.getByPlaceholder(/email address/i).fill('buyer-e2e@homescount.test')
    await page.locator('#inq-message').fill('I would like to arrange a viewing please.')
    await page.locator('input[type="checkbox"][name="privacyConsent"]').check()
    await page.getByRole('button', { name: /send message/i }).click()

    await expect(page.getByText(/thanks.*message was sent/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('enquiry requires privacy consent', async ({ page }) => {
    const found = await gotoLiveListing(page)
    test.skip(!found, 'No live listings available')

    await page.getByPlaceholder(/your name/i).fill('Test Buyer')
    await page.getByPlaceholder(/email address/i).fill('buyer-e2e@homescount.test')
    await page.locator('#inq-message').fill('Quick question about the property.')
    await page.getByRole('button', { name: /send message/i }).click()

    await expect(page.getByText(/privacy policy/i)).toBeVisible()
  })

  test('demo listing disables enquiry form', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)

    const cards = page.locator('a[href^="/properties/"]')
    const count = await cards.count()
    if (count === 0) {
      test.skip(true, 'No listings to open')
    }

    for (let i = 0; i < Math.min(count, 5); i++) {
      await cards.nth(i).click()
      const sample = page.getByText(/sample listing/i)
      if (await sample.isVisible().catch(() => false)) {
        await expect(page.getByText(/messaging is unavailable for sample listings/i)).toBeVisible()
        return
      }
      await page.goto('/properties')
      await acceptCookies(page)
    }

    test.skip(true, 'No demo listings found in first 5 cards')
  })
})
