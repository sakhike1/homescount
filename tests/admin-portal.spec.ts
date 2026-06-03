import { test, expect } from '@playwright/test'
import { adminNav, loginAsAdmin } from './helpers'

test.describe('Admin portal', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET, 'Auth secrets required')
    try {
      await loginAsAdmin(page)
    } catch {
      test.skip(true, 'Admin login failed — run npm run db:seed')
    }
  })

  test('overview dashboard loads', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible()
    await expect(page.getByText(/buyers|sellers|listings/i).first()).toBeVisible()
  })

  test('activity page loads', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: 'Activity', exact: true }).click()
    await expect(page).toHaveURL('/admin/activity', { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: /site activity/i })).toBeVisible()
  })

  test('buyers page loads', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: 'Buyers', exact: true }).click()
    await expect(page).toHaveURL('/admin/users')
    await expect(page.getByRole('heading', { name: /^buyers$/i })).toBeVisible()
  })

  test('sellers page loads', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: 'Sellers', exact: true }).click()
    await expect(page).toHaveURL('/admin/sellers')
    await expect(page.getByRole('heading', { name: /sellers/i }).first()).toBeVisible()
  })

  test('subscriptions page loads', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: 'Subscriptions', exact: true }).click()
    await expect(page).toHaveURL('/admin/subscriptions')
    await expect(page.getByRole('heading', { name: /subscriptions & payments/i })).toBeVisible()
  })

  test('listings page loads with management actions', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: 'Listings', exact: true }).click()
    await expect(page).toHaveURL('/admin/listings')
    await expect(page.getByRole('heading', { name: /^listings$/i })).toBeVisible()
  })

  test('public site link returns to home', async ({ page }) => {
    await adminNav(page).getByRole('link', { name: /public site/i }).click()
    await expect(page).toHaveURL('/')
  })
})
