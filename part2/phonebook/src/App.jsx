import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from './PersonDB'

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    personService.getAll().then((r) => {
      setPersons(r.data);
    });
  }, []);

  const addPhoneNote = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    if (persons.some((p) => p.name === newName.trim())) {
      alert(`${newName.trim()} is already added to phonebook`);
      return;
    }
    const newNote = {
      name: newName.trim(),
      number: newNumber.trim(), 
    };

    personService.addNew(newNote).then((response_p) => {
      setPersons(persons.concat(response_p.data));
      setNewName('');
      setNewNumber('');
    });
  };

  const handleNewNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
  };

  const personsToShow = persons.filter((p) => {
    if (filterName.trim() === "") return true;
    return p.name.toLowerCase().includes(filterName.trim().toLowerCase());
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
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
