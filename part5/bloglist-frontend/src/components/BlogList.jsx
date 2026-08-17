import BlogItem from './BlogItem'
const BlogList = ({ blogs,userData,handleLike,handleDelete }) => {
  return (
    <div>


      {blogs.map(item => (
        <div key={item.id}>
          <BlogItem blog={item} userData={userData} handleLike={handleLike} handleDelete={handleDelete}></BlogItem>

        </div>
      ))}
    </div>
  )
}

export default BlogList