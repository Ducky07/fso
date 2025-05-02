import { useState, useEffect } from "react";
import { Search } from "./components/Search";
import { PersonForm } from "./components/PersonForm";
import { Numbers } from "./components/Numbers";
import { Notification } from "./components/Notification";
import numberService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    numberService.getAll().then((data) => {
      setPersons(data);
    });
  }, [notificationMessage]);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
  
    const existingPerson = persons.find((person) => person.name === newPerson.name);
  
    if (existingPerson) {
      if (window.confirm(
        `${newPerson.name} is already added to phonebook, would you like to replace the old number with the new one?`
      )) {
        numberService
          .update(existingPerson.id, newPerson)
          .then((data) => {
            setPersons(persons.map((person) => (person.id !== data.id ? person : data)));
            setNewName("");
            setNewNumber("");
            setNotificationMessage(`Updated ${newPerson.name}`);
            setTimeout(() => setNotificationMessage(null), 5000);
          })
          .catch((error) => {
            setNotificationMessage(
              `Error: Could not update ${newPerson.name}. ${error.response?.data?.error || error.message}`
            );
            setTimeout(() => setNotificationMessage(null), 5000);
          });
      }
    } else {
      numberService
        .create(newPerson)
        .then((data) => {
          setPersons(persons.concat(data));
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`Added ${newPerson.name}`);
          setTimeout(() => setNotificationMessage(null), 5000);
        })
        .catch((error) => {
          setNotificationMessage(
            `Error: Could not add ${newPerson.name}. ${error.response?.data?.error || error.message}`
          );
          setTimeout(() => setNotificationMessage(null), 5000);
        });
    }
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      numberService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotificationMessage(`Deleted ${person.name}`);
          setTimeout(() => setNotificationMessage(null), 5000);
        })
        .catch((error) => {
          setNotificationMessage(
            `Error: Could not delete ${person.name}. ${
              error.response?.data?.error || error.message
            }`
          );
          setTimeout(() => setNotificationMessage(null), 5000);
        });
    }
  };

  const handleFilterChange = (event) =>
    setFilter(event.target.value.toLowerCase());

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter)
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        isError={notificationMessage?.startsWith("Error:")}
      />
      <Search filter={filter} handleOnChange={handleFilterChange} />
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      <Numbers persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
