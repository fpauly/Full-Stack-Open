const Persons = ({ personsToShow }) => {
  return (
    <>
      <ul>
        {personsToShow.map((p) => (
          <li key={p.id}>
            {p.name} {p.number}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
