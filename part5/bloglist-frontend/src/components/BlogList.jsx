import BlogItem from "./BlogItem"
const BlogList = ({ blogs }) => {
    return (
        <div>


            {blogs.map(item => (
                <div key={item.id}>
                    <BlogItem blog={item}></BlogItem>

                </div>
            ))}
        </div>
    )
}

export default BlogList