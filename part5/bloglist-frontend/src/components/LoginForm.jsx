import Notification from "./Notification"
const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
  return (
    <div>


      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username' >username</label>
          <input type='text'
            id='username'
            required
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </div>


        <div>
          <label>
            password
            <input type='password'
              value={password}
              required
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>

  )
}

export default LoginForm