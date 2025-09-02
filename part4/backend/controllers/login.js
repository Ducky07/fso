import jwt from "jsonwebtoken";
import brypt from "bcrypt";
import express from "express";
import User from "../models/user.js";

const loginRouter = express.Router();

loginRouter.post("/", async (request, response, next) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await brypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

export default loginRouter;
