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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      
      const userData = await loginService.login({ username, password })
      blogService.setToken(userData.token)
      // console.log(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
    } catch (error) {
    
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    // console.log('loing in with', username, password)
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
                  setPassword={setPassword}/>)}
      {user && <BlogForm userData={user} blogs ={blogs}/>}
    </div>

  )
}

export default App