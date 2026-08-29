
import { test, expect, describe, beforeEach } from '@playwright/test'

const createBlog = async (page, title, username, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill('a new blog create by playwright')
  await page.getByLabel('author').fill('mluukkai')
  await page.getByLabel('url').fill('thisisatesturl.com')
  await page.getByRole('button', { name: 'create' }).click()
}

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

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('fan')
      await page.getByLabel('password').fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      // await page.getByRole('button', { name: 'create new blog' }).click()
      // await page.getByLabel('title').fill('a new blog create by playwright')
      // await page.getByLabel('author').fill('mluukkai')
      // await page.getByLabel('url').fill('thisisatesturl.com')
      // await page.getByRole('button', { name: 'create' }).click()
      createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')

      const blogList = page.getByTestId('blog')
      await expect(blogList).toContainText('a new blog create by playwright')
    })

    test('like can be click and increase', async ({ page }) => {
      // await page.getByRole('button', { name: 'create new blog' }).click()
      // await page.getByLabel('title').fill('a new blog create by playwright')
      // await page.getByLabel('author').fill('mluukkai')
      // await page.getByLabel('url').fill('thisisatesturl.com')
      // await page.getByRole('button', { name: 'create' }).click()

      createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('blog can be deleted which added by current user', async ({ page }) => {

      await createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('blog deleted')).toBeVisible()
    })

  })

})
