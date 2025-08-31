import express from "express";
import Blog from "../models/blog.js";

const blogsRouter = express.Router();

// all blogs
blogsRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
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
blogsRouter.post("/", (request, response, next) => {
  const body = request.body;
  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: "title, author or url is missing",
    });
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });
  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
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
