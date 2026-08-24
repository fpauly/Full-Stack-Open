
import { test, expect, describe, beforeEach } from '@playwright/test'


describe('blog app test', () => {

  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    // await page.goto('http://localhost:5173')
    const locator = page.getByText('Blogs')
    await expect(locator).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByText('login')).toBeVisible()
  })

})
