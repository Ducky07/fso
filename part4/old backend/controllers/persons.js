import express from "express";
import Person from "../models/person.js";

const personsRouter = express.Router();

// all persons
personsRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// single person by ID
personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: "person not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// remove a person
personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "person not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// add a new person
personsRouter.post("/", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }
  Person.insertOne({
    name: body.name,
    number: body.number,
  })
    .then((person) => {
      response.status(201).json(person);
    })
    .catch((error) => next(error));
});

// update a person's number
personsRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  if (!body.number) {
    return response
      .status(400)
      .json({ error: "number is required for update" });
  }
  Person.findOne({ _id: request.params.id })
    .updateOne({ number: body.number })
    .then((person) => {
      if (person) {
        response.status(200).json(person);
      } else {
        response.status(404).json({ error: "person not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// total number of persons with current date
personsRouter.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

export default personsRouter;
