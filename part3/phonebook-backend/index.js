const express = require("express");
const app = express();


app.use(express.json())


let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  let id = 0;
  do {
    id = Math.floor(Math.random() * 100000000);
  } while (persons.find((p) => p.id === id.toString()));
  return id.toString();
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  date = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
});
app.post("/api/persons",(request,response)=>{
  // const id = generateId();
  const person = {
    id:generateId(),
    name:request.body.name,
    number:request.body.number,
  }
  // const person = request.body;
  // console.log(request.body.name)
  // person.id = id;
  persons = persons.concat(person);
  response.json(person);
})
const PORT = 3008;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
