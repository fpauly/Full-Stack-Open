require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const baseUrl = "/api/persons";

morgan.token("request-body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :request-body"
  )
);

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

let persons = [];

const url = process.env.MONGODB_URI;

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get(baseUrl, (request, response) => {
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    response.json(persons);
  });
});

app.get(baseUrl + "/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.post(baseUrl, (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.delete(baseUrl + "/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then(()=>{
    response.status(204).end();
    
  })
  .catch((error) => {
      response.status(400).json({ error: "malformatted id" });
      next(error);
    });

  
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
