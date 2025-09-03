import express from "express";
import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import userExtractor from "../utils/userExtractor.js";

const blogsRouter = express.Router();

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// all blogs
blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  try {
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// single blog by ID
blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).json({ error: "blog not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// remove a blog
blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "blog not found" }).end();
      }
    })
    .catch((error) => next(error));
});

// add a new blog
blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  console.log(decodedToken.id);
  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: "title, author or url is missing",
    });
  }
  if (!user) {
    return response.status(400).json({
      error: "userId missing or invalid",
    });
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });
  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: error.message });
    });
});

// update a blog
blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "blog not found" }).end();
      }
    })
    .catch((error) => next(error));
});

export default blogsRouter;
