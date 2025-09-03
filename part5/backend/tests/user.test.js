import { test, describe, beforeEach, after } from "node:test";
import { strictEqual } from "node:assert";
import bcrypt from "bcrypt";
import app from "../app.js";
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../models/user.js";
import {
  usersInDb,
  findUserById,
  findUserByUsername,
} from "../utils/user_helper.js";

const api = supertest(app);

describe("User model tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      password: passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const users = await usersInDb(User);

    const newUser = {
      username: "newuser",
      name: "New User",
      password: "newpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb(User);
    strictEqual(usersAtEnd.length, users.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    if (!usernames.includes(newUser.username)) {
      throw new Error("New username not found in database");
    }
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await usersInDb(User);

    const newUser = {
      username: "root",
      name: "Superuser2",
      password: "anotherpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    strictEqual(result.body.error, "username must be unique");

    const usersAtEnd = await usersInDb(User);
    strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  after(async () => {
    mongoose.connection.close();
  });
});
