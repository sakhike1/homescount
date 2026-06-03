import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Home hero search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
  })

  test('buy tab search navigates to buy with query', async ({ page }) => {
    await page.getByRole('button', { name: 'Buy', exact: true }).click()
    await page.getByPlaceholder(/city, suburb or address/i).fill('Sandton')
    await page.getByRole('button', { name: /^search$/i }).click()
    await expect(page).toHaveURL(/\/buy\?.*q=Sandton/i)
  })

  test('rent tab search navigates to rent with query', async ({ page }) => {
    await page.getByRole('button', { name: 'Rent', exact: true }).click()
    await page.getByPlaceholder(/city, suburb or address/i).fill('Cape Town')
    await page.getByRole('button', { name: /^search$/i }).click()
    await expect(page).toHaveURL(/\/rent\?.*q=Cape/i)
  })

  test('sell tab shows list property CTA', async ({ page }) => {
    await page.getByRole('button', { name: 'Sell', exact: true }).click()
    await expect(page.getByRole('link', { name: /learn how to sell/i })).toBeVisible()
    await page.getByRole('link', { name: /learn how to sell/i }).click()
    await expect(page).toHaveURL('/sell')
  })

  test('popular area chip fills search', async ({ page }) => {
    await page.getByRole('button', { name: 'Durban', exact: true }).click()
    await expect(page.getByPlaceholder(/city, suburb or address/i)).toHaveValue('Durban')
  })
})
