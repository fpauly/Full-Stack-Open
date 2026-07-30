const BlogForm = ({userData, blogs})=>{
    return(
        <div>
            <h2>Blogs</h2>
            <br/>
            <label>{userData.name} loged in.</label>
            {blogs.map(item=>(
                <div key={item.id}>
                <div>{item.title}</div>
                <div>{item.auther}</div>
                </div>
            ))}
        </div>
    )
}

export default BlogForm