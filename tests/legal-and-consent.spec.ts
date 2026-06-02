import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Legal pages and consent', () => {
  test('footer legal links navigate correctly', async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    const footer = page.getByRole('contentinfo')

    await footer.scrollIntoViewIfNeeded()
    await footer.getByRole('link', { name: 'Privacy Policy' }).click()
    await expect(page).toHaveURL('/privacy')
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

    await page.goto('/')
    await acceptCookies(page)
    const footerAgain = page.getByRole('contentinfo')
    await footerAgain.scrollIntoViewIfNeeded()
    await footerAgain.getByRole('link', { name: 'Terms & Conditions' }).click()
    await expect(page).toHaveURL('/terms')

    await page.goto('/')
    await acceptCookies(page)
    const footerCookies = page.getByRole('contentinfo')
    await footerCookies.scrollIntoViewIfNeeded()
    await footerCookies.getByRole('link', { name: 'Cookie Policy' }).click()
    await expect(page).toHaveURL('/cookies')
  })

  test('cookie banner can be accepted', async ({ page }) => {
    await page.goto('/rent')
    await expect(page.getByRole('dialog', { name: /cookies/i })).toBeVisible()
    await acceptCookies(page)
    await expect(page.getByRole('dialog', { name: /cookies/i })).toBeHidden()
  })

  test('register page shows privacy consent patterns', async ({ page }) => {
    await page.goto('/register')
    await acceptCookies(page)
    await expect(page.getByText('Full Name')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })
})
