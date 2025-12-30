import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ id: "1", name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addPhoneNote = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;

    const newNote = {
      id: String(persons.length + 1),
      name: newName,
    };

    setPersons(persons.concat(newNote));
    setNewName("");
  };
  const handleNewNameChange = (event) => (setNewName(event.target.value));

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPhoneNote}>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
