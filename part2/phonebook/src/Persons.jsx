const Persons = ({ personsToShow,onDelete}) => {
  return (
    <>
      <ul>
        {personsToShow.map((p) => (
          <li key={p.id}>
            {p.name} {p.number} 
            <button  onClick={()=>onDelete(p.id)}>delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
