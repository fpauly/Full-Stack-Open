const BlogList = ({ blogs }) => {
    return (
        <div>


            {blogs.map(item => (
                <div key={item.id}>
                    <div>{item.title} {item.author}</div>

                </div>
            ))}
        </div>
    )
}

export default BlogList