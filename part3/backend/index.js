import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import "./utils/db.js";

import personsRouter from "./controllers/persons.js";
import Person from "./models/person.js";
import { errorHandler, unknownEndpoint } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use("/api/persons", personsRouter);

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(
      `<p>Phonebook has info for ${count} people</p>
         <p>${new Date()}</p>`,
    );
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
