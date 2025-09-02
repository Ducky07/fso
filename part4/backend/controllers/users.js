import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const usersRouter = express.Router();

// get all users
usersRouter.get("/", async (request, response, next) => {
  const users = await User.find({}).populate("blogs");
  try {
    response.json(users);
  } catch (error) {
    next(error);
  }
});

// get single user by ID
usersRouter.get("/:id", (request, response, next) => {
  User.findById(request.params.id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).json({ error: "user not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// add a new user
usersRouter.post("/", (request, response, next) => {
  const body = request.body;
  if (!body.username || !body.name || !body.password) {
    return response.status(400).json({
      error: "username, name or password is missing",
    });
  }
  if (body.password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }
  // Hash the password before saving
  const passwordHash = bcrypt.hashSync(body.password, 10);
  const user = new User({
    username: body.username,
    name: body.name,
    password: passwordHash,
  });
  user
    .save()
    .then((savedUser) => {
      response.status(201).json(savedUser);
    })
    .catch((error) => next(error));
});

// remove a user
usersRouter.delete("/:id", (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "user not found" }).end();
      }
    })
    .catch((error) => next(error));
});

export default usersRouter;
