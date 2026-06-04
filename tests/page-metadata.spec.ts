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
  test('site has Homescout document title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Homescout/i)
  })

  test('home page has SEO meta description', async ({ page }) => {
    await page.goto('/')
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /property for sale|south africa/i)
  })

  test('buy page has property-for-sale keywords in description', async ({ page }) => {
    await page.goto('/buy')
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /for sale|south africa/i)
  })

  test('robots.txt allows public pages', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toMatch(/sitemap/i)
    expect(body).toMatch(/admin/i)
  })

  test('sitemap.xml includes main landing URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toMatch(/\/buy/)
    expect(body).toMatch(/\/rent/)
    expect(body).toMatch(/\/properties/)
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
