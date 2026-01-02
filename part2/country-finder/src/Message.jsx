const Message = ({message}) => {
  if (message === null) return null;
  return (
    <>
      <div>
        <p>{message}</p>
      </div>
    </>
  );
};

export default Message