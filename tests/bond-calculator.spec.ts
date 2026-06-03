import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'

test.describe('Bond calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/bond-calculator')
    await acceptCookies(page)
  })

  test('shows affordability estimate from default inputs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bond affordability/i })).toBeVisible()
    await expect(page.getByText(/property price you may qualify for/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /browse homes in your range/i })).toBeVisible()
  })

  test('updates when income is cleared', async ({ page }) => {
    await page.locator('#income').fill('')
    await expect(page.getByText(/enter your monthly income/i)).toBeVisible()
  })

  test('linked from home quick tools', async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    await page.getByRole('link', { name: /bond calculator/i }).click()
    await expect(page).toHaveURL(/\/tools\/bond-calculator/)
  })
})
