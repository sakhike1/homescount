import { test, expect } from '@playwright/test'
import { acceptCookies, navbarLogo } from './helpers'

test.describe('Branding', () => {
  test('HS logo appears in navbar on buy page', async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
    await expect(navbarLogo(page)).toBeVisible()
    await expect(navbarLogo(page)).toContainText('HS')
  })

  test('Homescout wordmark appears in footer on home page', async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByRole('link', { name: /Homescout/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /Homescout/i })).toContainText('scout')
  })

  test('logo links to home from properties page', async ({ page }) => {
    await page.goto('/properties')
    await acceptCookies(page)
    await navbarLogo(page).click()
    await expect(page).toHaveURL('/')
  })
})
