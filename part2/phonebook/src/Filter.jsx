const Filter = (props) => {
  return (
    <>
      <div>
        <label htmlFor="filterInput">Filter shown with</label>
        <input id="filterInput" value={props.filterName} onChange={props.onChange}></input>
      </div>
    </>
  );
};

export default Filter