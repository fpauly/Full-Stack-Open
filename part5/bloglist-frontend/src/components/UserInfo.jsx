const UserInfo = ({ userData, handleLogout }) => {
    return (
        <div>
            <label>{userData.name} logged in</label>
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}
export default UserInfo