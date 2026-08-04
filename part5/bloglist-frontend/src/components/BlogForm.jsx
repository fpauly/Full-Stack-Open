const BlogForm = ({ handleLogout, userData, blogs }) => {
    return (
        <div>
            <h2>Blogs</h2>
            <br />
            <div >
                <label>{userData.name} logged in.</label>
                <button onClick={handleLogout}>log out</button>
                <p></p>
            </div>

            {blogs.map(item => (
                <div key={item.id}>
                    <div>{item.title}</div>
                    <div>{item.auther}</div>
                </div>
            ))}
        </div>
    )
}

export default BlogForm