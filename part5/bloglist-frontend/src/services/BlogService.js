import axios from 'axios'
const baseUrl = '/api/blogs'

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const result = await axios.get(baseUrl)
  const blogs = result.data
  blogs.sort((a,b)=>b.likes-a.likes)
  return blogs

}

const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async (newObject) => {
  const config = {
    headers: { authorization: token } //大小写不敏感 Authorization authorization 都可以
  }

  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
  return response.data
}
const deleteBlog = async (id) => {
  const config = {
    headers: { authorization: token } //大小写不敏感 Authorization authorization 都可以
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, createBlog, updateBlog, deleteBlog, setToken }