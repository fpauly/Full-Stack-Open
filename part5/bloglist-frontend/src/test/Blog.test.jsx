import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogItem from '../components/BlogItem'

test('test render title and author', () => {
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