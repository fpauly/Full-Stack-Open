import axios from 'axios'
const baseUrl = '/api/blogs'

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

let token = null

const setToken = (newToken) =>{
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const result = await axios.get(baseUrl)

  return result.data

}

const createBlog = async (newObject)=>{
  const config = {
    headers:{Authorization:token}
  }

  const response = await axios.post(baseUrl,newObject,config)
  return response.data
}

const updateBlog = async (id , newObject) => {
  const config = {
    headers : {authorization:token} //大小写不敏感 Authorization authorization 都可以
  }

  const response = await axios.put(`${baseUrl}/${id}`,newObject,config)
  return response.data
}
const deleteBlog = async (id, blogData)=>{
  const config = {
    headers : {authorization:token} //大小写不敏感 Authorization authorization 都可以
  }
  const response = await axios.delete(`${baseUrl}/${id}`,blogData,config)
  return response.data
}

export default { getAll,createBlog,updateBlog,deleteBlog,setToken }