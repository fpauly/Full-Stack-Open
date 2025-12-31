import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ id: "1", name: "Arto Hellas",number:"+3584499888"}]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addPhoneNote = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    if (persons.some((p) => p.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const newNote = {
      id: String(persons.length + 1),
      name: newName,
      number:newNumber
    };

    setPersons(persons.concat(newNote));
    setNewName("");
    setNewNumber("");
  };

  const handleNewNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPhoneNote}>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((p) => (
          <li key={p.id}>{p.name} {p.number}</li>
          
        ))}
      </ul>
    </div>
  );
};

export default App;
