const Notification = ({ message,classid }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={classid}>
      {message}
    </div>
  )
}

export default Notification