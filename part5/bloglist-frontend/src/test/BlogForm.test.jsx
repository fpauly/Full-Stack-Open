import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditBlogForm from '../components/EditBlogForm'

const blogData = {
  title: 'most leave are green',
  author: 'Aino',
  url: 'www.aino.com',

}


test('test blog form: edit and submit right content', async () => {
  const handleMockCreate = vi.fn()
  const user = userEvent.setup()
  render(<EditBlogForm handleCreate={handleMockCreate} />)
  const inputs = screen.getAllByRole('textbox')
  await (user.type(inputs[0], blogData.title))
  await (user.type(inputs[1], blogData.author))
  await (user.type(inputs[2], blogData.url))

  const button = screen.getByText('create')

  await user.click(button)

  expect(handleMockCreate.mock.calls[0][0]).toEqual(blogData)

  expect(handleMockCreate.mock.calls[0][0]).toEqual({
    title: blogData.title,
    url: blogData.url,
    author: blogData.author
  })

  expect(handleMockCreate.mock.calls[0][0].title).toBe(blogData.title)
  expect(handleMockCreate.mock.calls[0][0].url).toBe(blogData.url)
  expect(handleMockCreate.mock.calls[0][0].author).not.toBe(blogData.url)
  expect(handleMockCreate.mock.calls[0][0].author).toBe(blogData.author)
})