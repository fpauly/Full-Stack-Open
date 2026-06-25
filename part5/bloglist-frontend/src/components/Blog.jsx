const Blog = ({ blog }) => (
  <div>
    <div>
      {blog.title} {blog.author}

    </div>
    {/* <div>{blog.user.username}</div> */}
  </div>
)

export default Blog