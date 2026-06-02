import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Main navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
  })

  test('navbar links reach key pages', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click()
    await expect(page).toHaveURL('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Properties', exact: true }).click()
    await expect(page).toHaveURL(/\/properties/)

    await page.getByRole('navigation').getByRole('link', { name: 'Buy', exact: true }).click()
    await expect(page).toHaveURL('/buy')

    await page.getByRole('navigation').getByRole('link', { name: 'Rent', exact: true }).click()
    await expect(page).toHaveURL('/rent')

    await page.getByRole('navigation').getByRole('link', { name: 'Sell', exact: true }).click()
    await expect(page).toHaveURL('/sell')
  })

  test('sign in link opens login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })
})
