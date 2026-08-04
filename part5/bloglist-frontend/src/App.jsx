import { useState, useEffect } from 'react'
import blogService from './services/BlogService'
import Notification from './components/Notification'
import loginService from './services/LoginService'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  const fetchBlogs = async () => {
    const blogList = await blogService.getAll()
    setBlogs(blogList)
  }
  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const userData = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      // console.log(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
      fetchBlogs()
    } catch (error) {
      console.log('Error: ', error)
      setMessage('Wrong name or password')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    // console.log('loing in with', username, password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    // console.log('log out')
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
    setBlogs([])
  }


  // const loginForm = () => {
  //   return (
  //     <div>
  //       <h2>Log in to application</h2>
  //       <Notification message={message} />
  //       <form onSubmit={handleLogin}>
  //         <div>
  //           <label htmlFor='username' >username</label>
  //           <input type='text'
  //             id='username'
  //             value={username}
  //             onChange={({ target }) => setUsername(target.value)} />
  //         </div>


  //         <div>
  //           <label>
  //             password
  //             <input type='password'
  //               value={password}
  //               onChange={({ target }) => setPassword(target.value)}
  //             />
  //           </label>
  //         </div>
  //         <button type='submit'>login</button>
  //       </form>
  //     </div>

  //   )
  // }

  // const blogForm = () => {
  //   return (
  //     <div>
  //       <h2>blogs</h2>
  //       <label>{user.name} logged in</label>


  //       {blogs.map(blog =>
  //         <Blog key={blog.id} blog={blog} />
  //       )}
  //     </div>
  //   )
  // }
  return (
    <div>
      {!user && (<LoginForm
        message={message}
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword} />)}
      {user && <BlogForm handleLogout={handleLogout} userData={user} blogs={blogs} />}
    </div>

  )
}

export default App