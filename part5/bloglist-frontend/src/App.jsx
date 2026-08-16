import { useState, useEffect,useRef } from 'react'
import blogService from './services/BlogService'
import Notification from './components/Notification'
import loginService from './services/LoginService'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import EditBlogForm from './components/EditBlogForm'
import UserInfo from './components/UserInfo'
import AppTitle from './components/AppTitle'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const timeoutRef = useRef(null)

  const messageClasses = {
    normalClass: 'message',
    errorClass: 'error'
  }

  const [messageClass, setMessageClass] = useState(messageClasses.normalClass)

  const appTitles = {
    tLoginPLZ: 'Log in to application',
    tBlogs: 'blogs'
  }

  const [appTitle, setAppTile] = useState(appTitles.tLoginPLZ)

  const showMessage = (strMessage) => {
    setMessage(strMessage)
    setMessageClass(messageClasses.normalClass)
    if(timeoutRef.current)
    {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
    }, 3000)
  }
  const showError = (strMessage) => {
    setMessage(strMessage)
    setMessageClass(messageClasses.errorClass)
    if(timeoutRef.current)
    {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

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
      setAppTile(appTitles.tBlogs)
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
      setAppTile(appTitles.tBlogs)
    } catch (error) {
      console.log('Error: ', error)
      showError('Wrong name or password')

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
    setAppTile(appTitles.tLoginPLZ)
  }

  const handleCreate = async (blogData) => {
   

    try {
      await blogService.createBlog(blogData)
     
      showMessage(`a new blog ${title} by ${author} added`)
      fetchBlogs()
    }
    catch (error) {
      console.log('Error: ', error)
      showError('Something went wrong')
    }

  }

  const handleLike = async (blogData)=> {
    try{
      await blogService.updateBlog(blogData)
      showMessage(`One more like!`)
      fetchBlogs()
    }
    catch (error) {
      console.log('Error: ', error)
      showError('Something went wrong')
    }
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
      <AppTitle appTitle={appTitle} />
      <Notification messageClass={messageClass} message={message} />
      {!user && (<LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword} />)}
      {user && (
        <div>

          <UserInfo userData={user} handleLogout={handleLogout} />
          <p />
          <Togglable buttonLabel='create new blog'>
            <EditBlogForm handleCreate={handleCreate} />
          </Togglable>
          
          <BlogList blogs={blogs} handleLike={handleLike} />
        </div>
      )}
    </div>

  )
}

export default App