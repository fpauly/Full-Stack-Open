import BlogItem from "./BlogItem"
const BlogList = ({ blogs,handleLike }) => {
    return (
        <div>


            {blogs.map(item => (
                <div key={item.id}>
                    <BlogItem blog={item} handleLike={handleLike}></BlogItem>

                </div>
            ))}
        </div>
    )
}

export default BlogList