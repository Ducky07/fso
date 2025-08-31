import express from "express";
import cors from "cors";
import morgan from "morgan";
import { port } from "./utils/config.js";

import "./utils/db.js";

import blogsRouter from "./controllers/blogs.js";
import {
  errorHandler,
  unknownEndpoint,
  requestLogger,
} from "./utils/middleware.js";

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

app.use("/api/blogs", blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
app.use(requestLogger);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
