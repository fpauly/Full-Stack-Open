import { useState, useEffect, useRef } from 'react'
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

  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')

  const timeoutRef = useRef(null)

  const messageClasses = {
    normalClass: 'message',
    errorClass: 'error'
  }

  const [messageClass, setMessageClass] = useState(messageClasses.normalClass)

  const appTitleEnum = {
    tLoginPLZ: 'Log in to application',
    tBlogs: ''
  }

  const appTitle = user ? appTitleEnum.tBlogs : appTitleEnum.tLoginPLZ

  const showMessage = (strMessage) => {
    setMessage(strMessage)
    setMessageClass(messageClasses.normalClass)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
    }, 3000)
  }
  const showError = (strMessage) => {
    setMessage(strMessage)
    setMessageClass(messageClasses.errorClass)
    if (timeoutRef.current) {
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


  //处理 token 出问题 或者后台user 找不到的情况，在axiosConfig 里注册了这个event事件，如果从后台拿到401 的status 会抛出事件
  useEffect(() => {
    const handleSessionExpired = () => setUser(null)
    window.addEventListener('sessionExpired', handleSessionExpired)


    //返回一个清理的函数，useeffect 的第一个参数可以接收一个返回的函数，如果这个函数不为空，会在组件销毁的时候调用
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
    }
  }, [])


  //   不可以把useEffect 的回调函数本身写成 async 因为 useEffect 的第一个参数，要么不返回任何东西，要么返回一个"清理函数"
  //   而 async 函数的返回值，永远是一个 Promise（哪怕你函数体里什么都没 return，
  //   它也会隐式返回 Promise<undefined>）。React 看到 useEffect 的回调返回了一个 Promise，
  //   会误以为你想返回一个清理函数，但 Promise 又不是函数，直接调用会报错，所以 React 会在控制台打印警告：
  // Warning: useEffect must not return anything besides a function, which is used for clean-up
  useEffect(() => {

    const checkUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
      if (loggedUserJSON) {
        const userData = JSON.parse(loggedUserJSON)

        blogService.setToken(userData.token)

        try {
          // 这里调用一个取的方法，如果token过期之类的，会触发axiosconfig里的401错误处理 就可以每次刷新的时候如果登录状态变了就跳转登录
          await blogService.getAll()
          setUser(userData)
        } catch (error) {
          console.log(error)
        }


      }
    }

    checkUser()

  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const userData = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      console.log(userData)
      // console.log(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
      fetchBlogs()
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
  }

  const handleCreate = async (blogData) => {

    try {
      await blogService.createBlog(blogData)
      showMessage(`a new blog ${blogData.title} by ${blogData.author} added`)
      fetchBlogs()
    }
    catch (error) {
      console.log('Error: ', error)
      showError('Something went wrong')
    }

  }

  const handleLike = async (blogData) => {
    try {
      await blogService.updateBlog(blogData)
      showMessage('One more like!')
      fetchBlogs()
    }
    catch (error) {
      console.log('Error: ', error)
      showError('Something went wrong')
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      showMessage('blog deleted')
      fetchBlogs()
    }
    catch (error) {
      console.log('Error: ', error)
      showError('Somthing went wrong')
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
      <h1>Blogs</h1>
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
          <BlogList blogs={blogs} userData={user} handleLike={handleLike} handleDelete={handleDelete} />
        </div>
      )}
    </div>

  )
}

export default App