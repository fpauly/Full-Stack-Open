
import { test, expect, describe, beforeEach } from '@playwright/test'

const createBlog = async (page, title, username, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(username)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'cancel' }).click()
}

const likeBlog = async (page, title, times) => {
  const blogDiv = page.locator('[data-testid="test-blog"]', { hasText: title })
  await blogDiv.getByRole('button', { name: 'view' }).click()

  for (let i = 0; i < times; i++) {
    //正则表达式的写法，用来匹配，d+是贪婪匹配，d是一个数字，d+是匹配为尽可能多的number
    const likesText = await blogDiv.getByText(/likes \d+/).textContent()
    //匹配数字，第一个
    const currentLikes = Number(likesText.match(/\d+/)[0])
    await blogDiv.getByRole('button', { name: 'like' }).click()
    await expect(blogDiv.getByText(`likes ${currentLikes + 1}`)).toBeVisible()
  }
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
      await createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')

      const blogList = page.getByTestId('test-blog')
      await expect(blogList).toContainText('a new blog create by playwright')
    })

    test('like can be click and increase', async ({ page }) => {
      // await page.getByRole('button', { name: 'create new blog' }).click()
      // await page.getByLabel('title').fill('a new blog create by playwright')
      // await page.getByLabel('author').fill('mluukkai')
      // await page.getByLabel('url').fill('thisisatesturl.com')
      // await page.getByRole('button', { name: 'create' }).click()

      await createBlog(page, 'a new blog create by playwright', 'mluukkai', 'thisisatesturl.com')

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

      await page.getByLabel('username').fill('dr_who')
      await page.getByLabel('password').fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })

    test('blog list ordered by likes', async ({ page }) => {
      const title1 = 'blog one with 2 likes'
      await createBlog(page, title1, 'Fan', 'fan.com')
      // await expect(page.getByText('blog one with 1 likes')).toBeVisible() 
      //strict mode violation: getByText('blog one with 1 likes') resolved to 2 elements, because message and title both include same text

      await expect(page.getByTestId('test-blog').filter({ hasText: title1 })).toBeVisible()
      await likeBlog(page, title1, 2)

      const title2 = 'second blog, 5 likes'
      await createBlog(page, title2, 'Danylo', 'danylo.fi')
      await expect(page.getByTestId('test-blog').filter({ hasText: title2 })).toBeVisible()
      await likeBlog(page, title2, 5)

      const title3 = 'im the third one, 1 likes'
      await createBlog(page, title3, 'hello world', 'hi.com')
      await expect(page.getByTestId('test-blog').filter({ hasText: title3 })).toBeVisible()
      await likeBlog(page, title3, 1)


      const blogs = await page.getByTestId('test-blog').allTextContents()
      expect(blogs[0]).toContain(title2)
      expect(blogs[1]).toContain(title1)
      expect(blogs[2]).toContain(title3)

      //use another method to test, get number first
      const likeCounts = blogs.map(blogText => {
        const nCount = Number(blogText.match(/likes (\d+)/)[1])//[0] 是整个字符串 [1]是精确匹配的数字，如果有多个括号,以此类推[2]...
        return nCount
      })

      for (let i = 0; i < likeCounts.length - 1; i++) {
        expect(likeCounts[i]).toBeGreaterThanOrEqual(likeCounts[i + 1])
      }
      //another one

      const expectlikes = [...likeCounts].sort((a, b) => b - a)
      expect(likeCounts).toEqual(expectlikes)
    })



  })

})
