import { useState } from "react"
const EditBlogForm = ({ handleCreate }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const submitFunc = (event) => {
        event.preventDefault()
        const blogData = {
            title: title,
            author: author,
            url: url
        }
        handleCreate(blogData)
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return (
        <div>
            <h2>create new</h2>
            <p></p>
            <form onSubmit={submitFunc}>
                <div>
                    <label>title:
                        <input type='text' required value={title} onChange={({ target }) => setTitle(target.value)}></input>
                    </label>
                </div>
                <div>
                    <label>author:
                        <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)}></input>
                    </label>
                </div>
                <div>
                    <label>url:
                        <input type='text' required value={url} onChange={({ target }) => setUrl(target.value)}></input>
                    </label>
                </div>
                <div><button type="submit">create</button></div>

            </form>

        </div>

    )
}

export default EditBlogForm