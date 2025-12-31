import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./PersonDB";

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

    const newNote = {
      name: newName.trim(),
      number: newNumber.trim(),
    };

    const existingP = persons.find((p) => p.name === newName.trim());

    // if (persons.some((p) => p.name === newName.trim())) {
    if (existingP) {
      if (
        window.confirm(
          `${newName.trim()} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService.update(existingP.id, newNote).then((response_p) => {
          setPersons(currentState=>currentState.map(p=>(p.id===existingP.id?response_p.data:p)));
          setNewName("");
          setNewNumber("");
        });
        return;
      }
    }

    personService.addNew(newNote).then((response_p) => {
      setPersons(currentState=>currentState.concat(response_p.data));
      setNewName("");
      setNewNumber("");
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

  const onDeleteClick = (id) => {
    // console.log(id)
    if (window.confirm("This will delete the number. Continue?"))
      personService.delRecord(id).then((r) => {
        setPersons(currentState=>currentState.filter((p) => p.id !== id));
      });
  };

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
      <Persons personsToShow={personsToShow} onDelete={onDeleteClick} />
    </div>
  );
};

export default App;
