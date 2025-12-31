import { useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { id: "1", name: "Arto Hellas", number: "39-44-5323523" },
    { id: "2", name: "Ada Lovelace", number: "40-12-9876543" },
    { id: "3", name: "Linus Torvalds", number: "41-55-1234567" },
    { id: "4", name: "Grace Hopper", number: "42-88-7654321" },
    { id: "5", name: "Alan Turing", number: "43-01-1112223" },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  const addPhoneNote = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    if (persons.some((p) => p.name === newName.trim())) {
      alert(`${newName.trim()} is already added to phonebook`);
      return;
    }
    const newNote = {
      id: String(persons.length + 1),
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(newNote));
    setNewName("");
    setNewNumber("");
  };

  const handleNewNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
  };

  const personsToShow = persons.filter((p) => {
    if (filterName.trim() === "") return true;
    return p.name.toLowerCase().includes(filterName.toLowerCase());
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter
          id="filterName"
          filterName={filterName}
          onChange={handleFilterNameChange}
        />
      </div>

      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPhoneNote}
        newName={newName}
        newNumber={newNumber}
        onNewNameChange={handleNewNameChange}
        onNewNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}/>
    </div>
  );
};

export default App;
