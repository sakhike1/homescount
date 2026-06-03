import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

const pagesWithTitles = [
  { path: '/', h1: /find the home/i },
  { path: '/buy', h1: /find a home/i },
  { path: '/rent', h1: /find a rental/i },
  { path: '/sell', h1: /list your property/i },
  { path: '/login', h1: /welcome back/i },
  { path: '/privacy', h1: /privacy policy/i },
] as const

test.describe('Page metadata', () => {
  test('site has Homescount document title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/homescount/i)
  })

  for (const { path, h1 } of pagesWithTitles) {
    test(`${path} has expected h1`, async ({ page }) => {
      await page.goto(path)
      await acceptCookies(page)
      await expect(page.locator('h1').first()).toContainText(h1)
    })
  }

  test('home page has single main h1', async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('favicon is configured', async ({ page }) => {
    await page.goto('/')
    const icon = page.locator('link[rel="icon"], link[rel="shortcut icon"]')
    await expect(icon.first()).toHaveAttribute('href', /.+\.(svg|ico|png)/i)
  })
})
