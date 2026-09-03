
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
      await expect(page.getByText('remove')).toBeVisible()

      //使用 page.on 注册弹窗而且要提前注册。page.on 注册后不会自动取消，可以相应多次弹窗，可以用计数器来控制。
      //page.once 也可以，但是最好用在确认可以弹出的多次弹窗，因为需要每次弹出前注册一个独立的响应事件。可能会第一个并没有弹出导致响应了第二个事件，这样有可能通过测试。

      //'dialog' 是固定的事件名称
      //       page.on('dialog', ...)      // 原生弹窗（alert/confirm/prompt）
      // page.on('console', ...)     // 页面里 console.log 的输出
      // page.on('request', ...)     // 发出的网络请求
      // page.on('response', ...)    // 收到的网络响应
      // page.on('pageerror', ...)   // 页面 JS 报错
      // page.on('popup', ...)       // 新开的弹出窗口/标签页
      // page.on('close', ...)       // 页面关闭

      page.on('dialog', async dialog => {// dialog === (dialog) != ({dialog}) 解构的花括号是不可以省略的
        console.log('dialog pop up:', dialog.message())
        await dialog.accept()
      })


      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('blog deleted')).toBeVisible()
    })

    test('users can not see the remove button when they are seeing the blogs not belong to them', async ({ page, request }) => {
      await createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).toBeVisible()
      //log out 
      await page.getByRole('button', { name: 'logout' }).click()

      const addUserResponse = await request.post('http://localhost:3018/api/users', {
        data: {
          name: 'who am i',
          username: 'dr_who',
          password: '123456'
        }
      })
      expect(addUserResponse.ok()).toBeTruthy()
    })

  })

})
