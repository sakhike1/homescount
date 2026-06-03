import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Landing hero actions', () => {
  test('buy hero browse CTA goes to properties', async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
    await page.getByRole('link', { name: /browse homes for sale/i }).click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('rent hero browse CTA goes to properties', async ({ page }) => {
    await page.goto('/rent')
    await acceptCookies(page)
    await page.getByRole('link', { name: /browse rentals/i }).click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('sell hero register CTA goes to seller signup', async ({ page }) => {
    await page.goto('/sell')
    await acceptCookies(page)
    await page.getByRole('link', { name: /start listing free/i }).click()
    await expect(page).toHaveURL(/\/register\?role=SELLER/)
  })

  test('buy to rent navigation updates hero copy', async ({ page }) => {
    await page.goto('/buy')
    await acceptCookies(page)
    await expect(page.getByRole('heading', { name: /find a home/i })).toBeVisible()

    await page.getByRole('navigation').getByRole('link', { name: 'Rent', exact: true }).click()
    await expect(page).toHaveURL('/rent')
    await expect(page.getByRole('heading', { name: /find a rental/i })).toBeVisible()
  })
})
