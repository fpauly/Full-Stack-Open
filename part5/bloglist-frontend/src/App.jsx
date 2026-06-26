import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState['']
  const [password, setPassword] = useState['']

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }
  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    console.log('loing in with', username, password)
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username' >username</label>
          <input type='text'
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </div>


        <div>
          <label>
            password
            <input type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
      <br></br>
      <p>below is for testing</p>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App