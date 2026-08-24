import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogItem from '../components/BlogItem'

const blogData = {
  title: 'most leave are green',
  author: 'Aino',
  url: 'www.aino.com',
  likes: 5,
  user: {
    username: 'fan y',
    user: 'fan',
    id: '123456'
  }
}
const userData = {
  id: '123456',
  user: 'fan',
  username: 'fan y'
}



test('test render title and author', () => {


  const handleLike = (blog) => { console.log(blog.title) }
  const handleDelete = (id) => { console.log(id) }
  render(<BlogItem blog={blogData} userData={userData} handleLike={handleLike} handleDelete={handleDelete} />)
  const titleName = screen.getByText('most leave are green Aino')
  expect(titleName).toBeDefined()

  const urlContent = screen.getByText('www.aino.com')
  expect(urlContent).not.toBeVisible()

  const likesContent = screen.getByText('likes 5')
  expect(likesContent).not.toBeVisible()
})

test('test view clicked, then url and likes showed up', async () => {

  render(<BlogItem blog={blogData} userData={userData} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlContent = screen.getByText('www.aino.com')
  expect(urlContent).toBeDefined()

  const likesContent = screen.getByText('likes 5')
  expect(likesContent).toBeDefined()
})

test('test like button clicked twice', async () => {

  const mockLike = vi.fn()
  render(<BlogItem blog={blogData} userData={userData} handleLike={mockLike} />)
  const user = userEvent.setup()
  const button = screen.getByText('like')
  for (let i = 0; i < 2; i++) {
    await user.click(button)
  }

  expect(mockLike.mock.calls).toHaveLength(2)
})
