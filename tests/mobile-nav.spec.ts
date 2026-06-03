import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click()
    const menu = page.getByRole('dialog', { name: /navigation menu/i })
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Rent', exact: true })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Sell', exact: true })).toBeVisible()
    await expect(menu.getByRole('link', { name: /sign in/i })).toBeVisible()
    await expect(menu.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('header hides sign in on small screens until menu opens', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('link', { name: /sign in/i })).toHaveCount(0)
  })

  test('mobile menu navigates to rent page', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.getByRole('dialog', { name: /navigation menu/i }).getByRole('link', { name: 'Rent', exact: true }).click()
    await expect(page).toHaveURL('/rent')
  })

  test('mobile menu can be closed', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.getByRole('button', { name: /close menu/i }).first().click()
    await expect(page.getByRole('dialog', { name: /navigation menu/i })).toBeHidden()
  })
})
