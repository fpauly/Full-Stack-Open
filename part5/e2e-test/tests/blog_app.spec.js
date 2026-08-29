
import { test, expect, describe, beforeEach } from '@playwright/test'


describe('blog app test', () => {

  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3018/api/testing/reset')
    expect(resetResponse.ok()).toBeTruthy()

    const addUserResponse = await request.post('http://localhost:3018/api/users', {
      data: {
        name: 'Fan Yin',
        username: 'fan',
        password: '123456'
      }
    })
    expect(addUserResponse.ok()).toBeTruthy()

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

  describe('login test', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('fan')
      await page.getByLabel('password').fill('123456')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Fan Yin logged in')).toBeVisible()

    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('fan')
      await page.getByLabel('password').fill('12345+6')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong name or password')).toBeVisible()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong name or password')
    })
  })


})
