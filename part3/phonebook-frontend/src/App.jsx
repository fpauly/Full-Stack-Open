import { useEffect, useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from './PersonDB'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [classid, setClassid] = useState('message')

  useEffect(() => {
    personService.getAll().then((r) => {
      setPersons(r)
    })
  }, [])

  const addPhoneNote = (event) => {
    event.preventDefault()

    if (!newName.trim()) {
      setErrorMessage('Name cannot be empty')
      setClassid('error')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    if (!newNumber.trim()) {
      setErrorMessage('Number cannot be empty')
      setClassid('error')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    const newNote = {
      name: newName.trim(),
      number: newNumber.trim(),
    }

    const normalize = (str) => str.trim().toLowerCase()

    const existingP = persons.find(
      (p) => normalize(p.name) === normalize(newName)
    )

    // if (persons.some((p) => p.name === newName.trim())) {
    if (existingP) {
      if (
        window.confirm(
          `${newName.trim()} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingP.id, newNote)
          .then((response_p) => {
            setPersons((currentState) =>
              currentState.map((p) => (p.id === existingP.id ? response_p : p))
            )
            setNewName('')
            setNewNumber('')
            setErrorMessage(`Updated ${newNote.name}`)
            setClassid('message')
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
          .catch((error) => {
            setErrorMessage(
              error.response?.data?.error || 'Something went wrong'
            )
            setClassid('error')
            setTimeout(() => setErrorMessage(null), 3000)
          })
      }
      return
    }

    personService
      .addNew(newNote)
      .then((response_p) => {
        setPersons((currentState) => currentState.concat(response_p))
        setNewName('')
        setNewNumber('')
        setErrorMessage(`Added ${newNote.name}`)
        setClassid('message')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || 'Something went wrong')
        setClassid('error')
        setTimeout(() => setErrorMessage(null), 3000)
      })
  }

  const handleNewNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }

  // console.log(persons);
  const personsToShow = persons.filter((p) => {
    if (filterName.trim() === '') return true
    return p.name.toLowerCase().includes(filterName.trim().toLowerCase())
  })

  const onDeleteClick = (person) => {
    // console.log(id)
    if (window.confirm('This will delete the number. Continue?'))
      personService
        .delRecord(person.id)
        .then(() => {
          setPersons((currentState) =>
            currentState.filter((p) => p.id !== person.id)
          )
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setClassid('error')
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} classid={classid} />
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
  )
}

export default App
