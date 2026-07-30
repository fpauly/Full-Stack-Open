const BlogItem = ({ blog }) => (
  <div>
    <div>
      {blog.title} {blog.author}

    </div>
    {/* <div>{blog.user.username}</div> */}
  </div>
)

export default BlogItem