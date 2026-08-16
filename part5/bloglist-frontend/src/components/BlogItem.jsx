import { useState } from "react"
import BlogService from "../services/BlogService"
const BlogItem = ({ blog,userData,handleLike,handleDelete }) => 
{
  const [visible, setVisible] = useState(false)
   
  // const hideWhenVisible = {display: visible?'none':''}
  // const showWhenVisible = {display: visible?'':'none'}

  const showDetail = {display: visible?'':'none'}
  const buttonTxt = visible?'hide':'view'
  const toggleVisibility = ()=>{
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    
  }


  const addOneLike = ()=>{
    const newBlog = {...blog,likes:blog.likes+1}
    
    // console.log(blog.likes)
    handleLike(newBlog)

  }
  const deleteBlog = ()=>{
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
   { handleDelete(blog.id)}
    
  }
  // const showRemove = blog.user.id === userData.id?{}:{display:'none'}
  return (
    <div style={blogStyle}>
      <div >
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{buttonTxt}</button>
      </div>
      <div style={showDetail}>
        <div>
         
          
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={addOneLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        
        {
        
        blog.user.id === userData.id&&
        (  <div >
            <button onClick={deleteBlog}>remove</button>
          </div>)
        }
      </div>
    </div>
  )
}

export default BlogItem