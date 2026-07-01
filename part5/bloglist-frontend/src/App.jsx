import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }
  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userData = await loginService.login({ username, password })
      setUser(userData)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('FULL ERROR OBJECT:', error)
      console.log('error.message:', error.message)
      console.log('error.name:', error.name)
      console.log('error.code:', error.code)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    console.log('loing in with', username, password)
  }


  if (user === null) {
    return (
      <div>
        <h2>login</h2>
        <Notification message={message} />
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
      </div>

    )
  }
  return (
    <div>

      <Notification message={message} />

      <div>{user.username}</div>

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