import { useState } from "react"
const BlogItem = ({ blog,handleLike }) => 
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
    blog.likes = blog.likes+1
    // console.log(blog.likes)
    handleLike(blog)

  }
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


      </div>
    </div>
  )
}

export default BlogItem