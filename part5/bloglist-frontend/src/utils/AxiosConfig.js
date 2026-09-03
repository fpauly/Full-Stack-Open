import axios from 'axios'

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('loggedBlogUser')
      window.dispatchEvent(new Event('sessionExpired'))
    }
    return Promise.reject(error)
  }
)