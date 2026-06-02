import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

const publicRoutes = [
  { path: '/', heading: /find the home/i },
  { path: '/buy', heading: /find a home/i },
  { path: '/rent', heading: /find a rental/i },
  { path: '/sell', heading: /list your property/i },
  { path: '/properties', heading: /search in|homescount listings/i },
  { path: '/login', heading: /welcome back/i },
  { path: '/register', heading: /create an account/i },
  { path: '/privacy', heading: /privacy policy/i },
  { path: '/terms', heading: /terms of use/i },
  { path: '/cookies', heading: /cookie policy/i },
  { path: '/admin/login', heading: /admin access/i },
] as const

test.describe('Public pages', () => {
  for (const route of publicRoutes) {
    test(`${route.path} loads`, async ({ page }) => {
      await page.goto(route.path)
      await acceptCookies(page)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('h1').first()).toContainText(route.heading)
    })
  }

  test('properties buy filter navigates with type=buy', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)
    await page.locator('label:has(input[value="buy"])').click()
    await expect(page).toHaveURL(/type=buy/)
  })

  test('properties rent filter navigates with type=rent', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)
    await page.locator('label:has(input[value="rent"])').click()
    await expect(page).toHaveURL(/type=rent/)
  })

})
