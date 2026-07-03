const loginForm = ({ message, handleLogin, username, password, setUsername, setPassword }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username' >username</label>
          <input type='text'
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </div>


        <div>
          <label>
            password
            <input type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>

  )
}

export default loginForm